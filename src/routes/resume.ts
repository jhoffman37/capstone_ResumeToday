import express, {Request, Response} from "express";
import { Resume, ResumeDB } from "../data/resumeDB";
import {AuthUser, authenticateTokenStrict} from "../auth/auth";
const router = express.Router();

type FormData = {
  projectTitle: string,
  obj: string | undefined,
  education: any[],
  workExperience: any[],
  skills: string | undefined,
  awards: string | undefined,
  user: AuthUser | null
}

router.get("/resume-view", authenticateTokenStrict, async (req: Request, res: Response) => {
  const resumes = await ResumeDB.getResumeByUserId(req.user.id);
  console.log(resumes);
  res.render("pages/viewResumes.ejs", {user: req.user ? req.user : null, resumes: resumes});
})
router.get("/resume-edit/:id", authenticateTokenStrict, async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params.id);
  const resume_data = await ResumeDB.get(id);

  if (!resume_data) {
    const msg = `Could not load resume as it does not exist`;
    res.render("pages/viewResumes.ejs", { user: req.user ? req.user : null,
      msg
    });
    return;
  }

  if (!req.user || resume_data.user_id !== req.user.id) {
    const msg = `You do not have permission to edit this resume`;
    res.render("pages/viewResumes.ejs", { user: req.user ? req.user : null,
      msg
    });
    return;
  }

  // Create class representing the resume
  const resume = new Resume();
  resume.id = resume_data.id;
  resume.user_id = resume_data.user_id;
  resume.title = resume_data.title;
  resume.html = resume_data.html;

  // Check HTML for possible form values

  const html: Document = resume.getAsHtmlElement();

  const education = [];
  for (const edu of html.querySelectorAll('.education')) {
    const data: any = {};

    data["schoolName"] = edu.querySelector('.school-name')?.innerHTML;
    data["dateOfGraduation"] = edu.querySelector('.edu-grad')?.innerHTML;
    data["where"] = edu.querySelector(".edu-where")?.innerHTML;
    data["certificates"] = edu.querySelector(".edu-certificates")?.innerHTML;

    education.push(data);
  }

  const workExperience = [];
  for (const work of html.querySelectorAll('.work-experience')) {
    const data: any = {};
    const workDuration = work.querySelector('.work-duration')?.innerHTML.split(' - ');

    data["position"] = work.querySelector('.work-position')?.innerHTML;
    data["company"] = work.querySelector('.work-company')?.innerHTML;
    data["startDate"] = workDuration?.at(0);
    data["endDate"] = workDuration?.at(1);
    data["where"] = work.querySelector(".work-where")?.innerHTML;
    data["jobDuties"] = work.querySelector('.work-duties')?.innerHTML;

    workExperience.push(data);
  }

  const data: FormData = {
    projectTitle: resume.title,
    obj: html.getElementById("obj")?.innerHTML,
    education,
    workExperience,
    skills: html.getElementById("skills")?.innerHTML,
    awards: html.getElementById("awards")?.innerHTML,
    user: req.user || null
  };
  res.render("pages/resumeForm.ejs", data);
});
router.get("/resume-new", authenticateTokenStrict, (req: Request, res: Response) => {
  res.render("pages/resumeForm.ejs", {user: req.user ? req.user : null});
});
router.get("/resume-view/:id", authenticateTokenStrict, async (req: Request, res: Response) => {
  try {
    const id: number = Number.parseInt(req.params.id);
    const resume: Resume = await ResumeDB.get(id);

    if (!req.user || resume.user_id !== req.user.id) {
      res.status(401).send('You do not have permission to view this resume')
      return;
    }

    res.render("pages/resume.ejs", { user: req.user ? req.user : null,
      title: resume.title,
      resume
    });
  } catch {
    res.status(404).send('This resume does not exist!')
  }

});
router.post("/resume-validate", authenticateTokenStrict, async function (req: Request, res: Response) {
  const result = {
    success: false,
    msg: '',
    resumeId: -1
  };

  const form = req.body.form;
  if (!form.title)
    result.msg += "Must include a title for this resume<br>";

  // Validate all education data
  const edu = {
    name: true,
    where: true,
    date: true
  }
  for (const data of form.education) {
    edu.name = edu.name && data.schoolName;
    edu.where = edu.where && data.where;
    edu.date = edu.date && data.dateOfGraduation;
  }

  if (!edu.name)
    result.msg += "Must include the name for your education(s)<br>";
  if (!edu.where)
    result.msg += "Missing the location (country, state, city) of your education(s)<br>";
  if (!edu.date)
    result.msg += "Must provide a graduation date<br>";

  // Validate all work experience data
  const work = {
    company: true,
    position: true,
    where: true,
    start: true
  }
  for (const data of form.workExperience) {
    work.company = work.company && data.company;
    work.position = work.position && data.position;
    work.where = work.where && data.where;
    work.start = work.start && data.startDate;
  }

  if (!work.company)
    result.msg += "Must include the name of the company you worked at<br>";
  if (!work.position)
    result.msg += "Must include your position title of your workplace(s)<br>";
  if (!work.where)
    result.msg += "Missing the location (country, state, city) of your workplace(s)<br>";
  if (!work.start)
    result.msg += "Must provide the date you started working at your workplace(s)<br>";

  // If there is an error message, we can safely assume success is false
  result.success = result.msg === "";

  if (result.success) {

    // Construct HTML
    //
    // We serialize the HTML data just in case the user wants
    // to more freely edit their resume page. By saving the HTML string
    // to the database, we need not worry about where elements are positioned.
    const obj = form.obj ? `<h2 id="obj">${form.obj}</h2>` : "";

    let education = form.education.length ? '<h2 id="education">Education</h2>' : "";

    for (const data of form.education) {
      education += `
        <section class="education">
          <h3 id="school-name">${data.schoolName}</h3>
          <div class="edu-setting">
            <span class="edu-grad">${data.dateOfGraduation}</span><br>
            <span class="edu-where">${data.where}</span>
          </div>
          <p class="edu-certificates">${data.certificates}</p>
        </section>
    `;
    }

    let work_exp = form.workExperience.length ? "<h2>Work Experience</h2>" : "";

    for (const data of form.workExperience) {
      const workDuration = `${data.startDate} - ${data.endDate}`;
      work_exp += `
        <section class="work-experience">
          <h3 class="work-position">${data.position}</h3>
          <span class="work-company">${data.company}</span>
          <div class="work-setting">
            <span class="work-duration">${workDuration}</span><br>
            <span class="work-where">${data.where}</span>
          </div>
          <p class="work-duties">${data.jobDuties}</p>
        </section>
      `;
    }

    const skills = form.skills ? `<h2>Skills</h2
      <p id="skills">${form.skills}</p>
    ` : "";

    const awards = form.awards ? `<h2>Awards</h2
      <p id="awards">${form.awards}</p>
    ` : "";

    const html = `
      ${obj}
      ${education}
      ${work_exp}
      ${skills}
      ${awards}
    `;

    // Insert resume into database
    const resume = new Resume();

    // Use -1 as a placeholder since this has no id yet
    resume.id = -1;

    resume.user_id = req.user.id;
    resume.title = form.title;
    resume.html = html;

    try {

      // Check if editing existing resume
      if (req.body.url.search("resume-edit") != -1) {
        const id = Number.parseInt(req.body.url.split('/')[2]);
        resume.id = id;
        result.resumeId = id;

        await ResumeDB.update(resume);

      } else {
        await ResumeDB.insert(resume);
        result.resumeId = (await ResumeDB.getAll()).length;
      }

    } catch (e) {
      console.error(e);

      result.success = false;
      result.msg += "Uh oh! A problem with saving this resume has occured. Please try again later";
    }

  }
  res.send(result);
});

export default router;
