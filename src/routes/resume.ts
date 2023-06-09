import express, {Request, Response} from "express";
import { Resume, ResumeDB, SharedUser } from "../data/resumeDB";
import {AuthUser, authenticateTokenStrict} from "../auth/auth";
import { UserDB } from "../data/userDB";
import { JSDOM } from "jsdom";

import showdown from 'showdown';

const html_to_pdf = require('html-pdf-node');
const router = express.Router();

type FormData = {
  projectTitle: string,
  obj: string | undefined,
  education: any[],
  workExperience: any[],
  skills: string | undefined,
  awards: string | undefined | null,
  user: AuthUser | null,
  resumeMD: string
}

router.get("/resume-view", authenticateTokenStrict, async (req: Request, res: Response) => {
  const resumes = await ResumeDB.getResumeByUserId(req.user.id);
  const all = await ResumeDB.getAll();
  const shared: any[] = [];

  for (const resume of all) {
    const owner = await UserDB.getUserById(resume.user_id);

    resume.shared_users.forEach(userStr => {
      const user: SharedUser = JSON.parse(userStr);
      if (user.user_id !== req.user.id)
        return;

      shared.push({
        resume,
        perms: user.perms,
        ownerName: owner.username
      });
    });
  }

  res.render("pages/viewResumes.ejs", {user: req.user ? req.user : null, resumes, shared});
});

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

  const canEdit = resume_data.shared_users.find(userStr => {
    const user: SharedUser = JSON.parse(userStr);
    return user.user_id === req.user.id && user.perms === "edit";
  }) || req.user.id === resume_data.user_id;

  if (!canEdit) {
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

    let [startDate, endDate] = "";

    if (workDuration) {
      startDate = workDuration[0];
      endDate = workDuration[1];
    }

    data["position"] = work.querySelector('.work-position')?.innerHTML;
    data["company"] = work.querySelector('.work-company')?.innerHTML;
    data["startDate"] = startDate;
    data["endDate"] = endDate;
    data["where"] = work.querySelector(".work-where")?.innerHTML;
    data["jobDuties"] = work.querySelector('.work-duties')?.innerHTML;

    workExperience.push(data);
  }

  const converter = new showdown.Converter();
  const resumeMD = converter.makeMarkdown(resume.html, new JSDOM().window.document);

  const skills = html.getElementById("skills")?.innerHTML;
  const data: FormData = {
    projectTitle: resume.title,
    obj: html.getElementById("obj")?.innerHTML,
    education,
    workExperience,
    skills: skills,
    awards: html.getElementById("awards")?.innerHTML,
    user: req.user || null,
    resumeMD
  };
  res.render("pages/resumeForm.ejs", data);
});
router.get("/resume-new", authenticateTokenStrict, (req: Request, res: Response) => {
  res.render("pages/resumeForm.ejs", {user: req.user ? req.user : null, resumeMD: "" });
});
router.get("/resume-view/:id", authenticateTokenStrict, async (req: Request, res: Response) => {
  try {
    const id: number = Number.parseInt(req.params.id);
    const resume: Resume = await ResumeDB.get(id);

    const canView = resume.shared_users.find(userStr => {
      const user: SharedUser = JSON.parse(userStr);

      // Since the other permissions require a user view the document
      // we don't need to check the permission here
      return user.user_id === req.user.id;
    }) || req.user.id === resume.user_id;

    if (!canView) {
      res.status(401).send('You do not have permission to view this resume')
      return;
    }

    const owner = await UserDB.getUserById(resume.user_id);
    const ownerName = `${owner.first_name} ${owner.last_name}`;
    res.render("pages/resume.ejs", { user: req.user ? req.user : null,
      title: resume.title,
      resume,
      ownerName
    });
  } catch {
    res.status(404).send('This resume does not exist!')
  }

});

router.post("/resume-share", authenticateTokenStrict, async function (req: Request, res: Response) {
  const result = {
    success: false,
    msg: '',
  };

  const userIds = [];

  // Attempt to retrieve entered user ids
  try {

    for (const username of req.body.usernames) {
      
      const userExists = await UserDB.checkUserExists(username);
      if (!userExists) {
        result.msg += `User with name '${username}' does not exist\n`;
        continue;
      }
      if (req.user && req.user.username === username) {
        result.msg += `You may not share with yourself as you already own this resume\n`;
        continue;
      }

      const user = await UserDB.getUserByUsername(username);
      userIds.push(user.id);
    }

  } catch (e) {
    console.error(e);
    result.msg += "A problem occured trying to retrieve users"
  }

  // Set permissions and update resume data
  const resumeId = Number.parseInt(req.body.resumeId);

  try {
    const resume = await ResumeDB.get(resumeId);

    for (const userId of userIds) {
      // Find existing user data and modify
      const prevData = resume.shared_users.find(userStr => {
        const user: SharedUser = JSON.parse(userStr);
        return user.user_id === userId;
      });

      // Remove old data from array
      if (prevData) {
        const idx = resume.shared_users.indexOf(prevData);
        resume.shared_users.splice(idx, 1)
      }

      resume.shared_users.push(`{ "user_id": ${userId}, "perms": "${req.body.perm}" }`);
    }

    await ResumeDB.update(resume);

  } catch (e) {
    console.error(e);
    result.msg += "Uh oh! Failed to update share settings for this resume";
  }

  result.success = result.msg === "";
  res.send(result);
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

    const skills = form.skills && form.skills.length ? `<h2>Skills</h2>
      <p id="skills">${form.skills}</p>
    ` : "";

    const awards = form.awards ? `<h2>Awards and Honors</h2>
      <p id="awards">${form.awards}</p>
    ` : "";

    const html = `
      ${obj}
      ${education}
      ${work_exp}
      ${skills}
      ${awards}
    `;

    try {

      // Check if editing existing resume
      if (req.body.url.search("resume-edit") != -1) {
        const id = Number.parseInt(req.body.url.split('/')[2]);
        const resume = await ResumeDB.get(id);

        resume.title = form.title;
        resume.html = html;

        result.resumeId = id;
        await ResumeDB.update(resume);

      } else {
        // Insert resume into database
        const resume = new Resume();
        
        resume.user_id = req.user.id;
        resume.title = form.title;
        resume.html = html;

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

router.post('/resume-direct-edit',  authenticateTokenStrict, async function (req: Request, res: Response) {
  const result = {
    success: false,
    msg: '',
    resumeId: -1
  };

  const converter = new showdown.Converter();
  const html: string = converter.makeHtml(req.body.markdown);

  if (!req.body.title)
    result.msg += "Must include a title for this resume<br>";
  else {
    try {

      // Check if editing existing resume
      if (req.body.url.search("resume-edit") != -1) {
        const id = Number.parseInt(req.body.url.split('/')[2]);
        const resume = await ResumeDB.get(id);
  
        resume.title = req.body.title;
        resume.html = html;
  
        result.resumeId = id;
        await ResumeDB.update(resume);
  
      } else {
        // Insert resume into database
        const resume = new Resume();
        
        resume.user_id = req.user.id;
        resume.title = req.body.title;
        resume.html = html;
  
        await ResumeDB.insert(resume);
        result.resumeId = (await ResumeDB.getAll()).length;
      }
  
    } catch (e) {
      console.error(e);
  
      result.success = false;
      result.msg += "Uh oh! A problem with saving this resume has occured. Please try again later";
    }
  }

  result.success = result.msg === "";
  res.send(result);
});

router.get('/resume-download/:id', authenticateTokenStrict, async function (req: Request, res: Response) {
  const resume = await ResumeDB.get(parseInt(req.params.id));

  if (!resume || resume.user_id !== req.user.id) {
    res.status(404).send("Not found");
    return;
  }

  const resumeHTML = resume.html;
  const resumeTitle = '<h1>' + resume.title + "</h1>";
  const file = {content: resumeTitle + resumeHTML};
  const options = {format: 'A4'};

  const pdf = await html_to_pdf.generatePdf(file, options);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${resume.title}.pdf`);
  res.send(pdf).status(200);
});

export default router;
