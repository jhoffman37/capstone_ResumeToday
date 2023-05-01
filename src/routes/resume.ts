import express, {Request, Response} from "express";
import { Resume, ResumeDB } from "../data/resumeDB";
import { User, UserDB} from "../data/userDB";
const router = express.Router();

router.get("/resume-new", (req: Request, res: Response) => {
  res.render("pages/resumeForm.ejs");
});
router.get("/resume-view/:id", async (req: Request, res: Response) => {
  try {
    const id: number = Number.parseInt(req.params.id);
    const resume: Resume = await ResumeDB.get(id);
    const user: User = (await UserDB.getAllUsers())[resume.user_id];
  
    res.render("pages/resume.ejs", {
      title: resume.title,
      resume,
      user
    });
  } catch {
    res.status(404).send('This resume does not exist!')
  }
  
});
router.post("/resume-validate", async function (req: Request, res: Response) {
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

  // Validate all work expierence data
  const work = {
    company: true,
    position: true,
    where: true,
    start: true
  }
  for (const data of form.workExpierence) {
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
    const obj = form.obj ? `<h2>${form.obj}</h2>` : "";

    let education = form.education.length ? "<h2>Education</h2>" : "";

    for (const data of form.education) {
      education += `
        <section class="education">
          <h3>${data.schoolName}</h3>
          <div class="edu-setting">
            <span class="edu-grad">${data.dateOfGraduation}</span>
            <span class="edu-where">${data.where}</span>
          </div>
          <p class="edu-certificates">${data.certificates}</p>
        </section>
    `;
    }

    let work_exp = form.workExpierence.length ? "<h2>Work Experience</h2>" : "";

    for (const data of form.workExpierence) {
      const workDuration = `${data.startDate} - ${data.endDate}`;
      work_exp += `
        <section class="work-experience">
          <h3>${data.position}</h3>
          <span class="work-company">${data.company}</span>
          <div class="work-setting">
            <span class="work-duration">${workDuration}</span>
            <span class="work-where">${data.where}</span>
          </div>
          <p class="work-duties">${data.jobDuties}</p>
        </section>
      `;
    }

    const skills = form.skills ? `<h2>Skills</h2
      <p>${form.skills}</p>
    ` : "";

    const awards = form.awards ? `<h2>Awards</h2
      <p>${form.awards}</p>
    ` : "";

    const html = `
      ${obj}
      ${education}
      ${work_exp}
      ${skills}
      ${awards}
    `;

    // Insert resume into database
    const resume: Resume = {
      // Use -1 as a placeholder since this has no id yet
      id: -1,
      //TODO: Get logged in user id
      user_id: 0,
      title: form.title,
      html
    };
    
    try {
      await ResumeDB.insert(resume);
      result.resumeId = (await ResumeDB.getAll()).length;
    } catch (e) {
      console.error(e);

      result.success = false;
      result.msg += "Uh oh! A problem with saving this resume has occured. Please try again later";
    }
    
  }
  res.send(result);
});

function isStringEmpty(str: string): boolean {
  return str === undefined || str === "";
}

export default router;