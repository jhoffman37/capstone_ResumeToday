import express, {Request, Response} from "express";
import {authenticateToken} from "../auth/auth";
const router = express.Router();

router.get("/", authenticateToken, (req: Request, res: Response) => {
  res.render("pages/home.ejs", {user: req.user ? req.user : null});
})
  .get("/home", async (req: Request, res: Response) => {
    res.redirect("/");
  })
  .get("/about", authenticateToken, async (req: Request, res: Response) => {
    res.render("pages/about.ejs", {user: req.user ? req.user : null});
  })
  .get("/contact", authenticateToken, async (req: Request, res: Response) => {
    res.render("pages/contact.ejs", {user: req.user ? req.user : null});
  })
  .get("/help", authenticateToken, async(req: Request, res: Response) => {
    res.render("pages/help.ejs", {user: req.user ? req.user : null});
  })
  .get("/login", authenticateToken, async (req: Request, res: Response) => {
    res.render("pages/login.ejs", {user: req.user ? req.user : null});
  })
  .get("/register", async (req: Request, res: Response) => {
    res.render("pages/register.ejs");
  });

export default router;
