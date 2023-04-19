import express, {Request, Response} from "express";
const router = express.Router();

router.get("/resume", (req: Request, res: Response) => {
  res.render("pages/newResume.ejs");
});

export default router;