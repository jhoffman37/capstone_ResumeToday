import express, {Request, Response} from "express";
const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.render("pages/home.ejs");
})
  .get("/about", (req: Request, res: Response) => {
    res.render("pages/about.ejs");
  })
  .get("/contact", (req: Request, res: Response) => {
    res.render("pages/contact.ejs");
  })
  .get("/help", async(req: Request, res: Response) => {
    res.render("pages/help.ejs");
  })
  .get("/login", (req: Request, res: Response) => {
    res.render("pages/login.ejs");
  })
  .get("/register", (req: Request, res: Response) => {
    res.render("pages/register.ejs");
  });

export default router;
