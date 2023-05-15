import bcrypt from "bcryptjs";

require('dotenv').config();
import express, {Request, Response} from "express";
import path from "path";
import Data from "./data/index";
import resumeRouter from "./routes/resume";
import indexRouter from "./routes/index";
import userAuthRouter from "./routes/userAuth";
import cookieParser from "cookie-parser";
import { UserDB } from "./data/userDB";

const PORT = process.env.PORT || 5163;

express()
  .use(express.static(path.join(__dirname, "../public")))
  .use(express.json())
  .use(cookieParser())
  .use(express.urlencoded( { extended: true }))
  .set("views", path.join(__dirname, "../views"))
  .set("view engine", "ejs")
  .use("/", indexRouter)
  .use(resumeRouter)
  .use('/user', userAuthRouter)
  .get("/health", async(req: Request, res: Response) => {
    if (Data.Users) {
      let data = await Data.Users.getAllUsers();
      if (data && data.length > 0) {
        res.status(200).send('OK');
      } else {
        res.status(500).send('Error');
      }
    }
  })
  // No idea where to put this, so it is going here. 
  // You're not my mom
  .post("/fetch-usernames", async (req: Request, res: Response) => {
    if (!req.body.filter)
      return;
    const filter = req.body.filter.toLowerCase();
    const usernames: string[] = [];

    const users = await UserDB.getAllUsers();
    for (const user of users) {
      if (!user.username.toLowerCase().startsWith(filter))
        continue;
      usernames.push(user.username);
    }

    res.send({ usernames });
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
