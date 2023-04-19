import express, {Request, Response} from "express";
const router = express.Router();

type ResumeData = {
  title: string,
  name: string,
  about: string,
};

router.get("/resume", (req: Request, res: Response) => {
  res.render("pages/newResume.ejs");
});
router.post("/resume/validate", function (req: Request, res: Response) {
  const result = {
    success: false,
    msg: ''
  };

  const data: ResumeData = req.body;

  if (isStringEmpty(data.title))
    result.msg += "Must include a title for this resume<br>";
  if (isStringEmpty(data.name))
    result.msg += "Must include your full name<br>";

  // If there is an error message, we can safely assume success is false
  result.success = result.msg === "";

  if (result.success) {
    //TODO Generate resume
  }
  res.send(result);
});

function isStringEmpty(str: string): boolean {
  return str === undefined || str === "";
}

export default router;