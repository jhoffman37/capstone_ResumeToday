import express, {Request, Response} from "express";
import { Resume, ResumeDB } from "../data/resumeDB";
import { User, UserDB} from "../data/userDB";
const router = express.Router();

router.get("/resume", (req: Request, res: Response) => {
  res.render("pages/newResume.ejs");
});
router.get("/resume/view/:id", async (req: Request, res: Response) => {
  try {
    const id: number = Number.parseInt(req.params.id);
    const resume: Resume = await ResumeDB.get(id);
    const user: User = (await UserDB.getAllUsers())[resume.user_id];
  
    res.render("pages/resume.ejs", {
      resume,
      user
    });
  } catch {
    res.status(404).send('This resume does not exist!')
  }
  
});
router.post("/resume/validate", async function (req: Request, res: Response) {
  const result = {
    success: false,
    msg: '',
    resumeId: -1
  };

  if (isStringEmpty(req.body.title))
    result.msg += "Must include a title for this resume<br>";

  // If there is an error message, we can safely assume success is false
  result.success = result.msg === "";

  if (result.success) {
    // Insert resume into database
    const resume: Resume = {
      // Use -1 as a placeholder since this has no id yet
      id: -1,
      //TODO: Get logged in user id
      user_id: 0,
      title: req.body.title,
      about: req.body.about,
    };
    
    await ResumeDB.insert(resume);
    result.resumeId = (await ResumeDB.getAll()).length;
  }
  res.send(result);
});

function isStringEmpty(str: string): boolean {
  return str === undefined || str === "";
}

export default router;