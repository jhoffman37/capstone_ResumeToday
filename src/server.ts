import bcrypt from "bcryptjs";

require('dotenv').config();
import express, {Request, Response} from "express";
import path from "path";
import Data from "./data/index";
import resumeRouter from "./routes/resume";
import indexRouter from "./routes/index";
import userAuthRouter from "./routes/userAuth";

import "bcryptjs";

const genTestPassword = async () => {
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash("password", salt);
  console.log("salt: " + salt);
  console.log("hashed password: " + hash);
}

genTestPassword();


const PORT = process.env.PORT || 5163;

express()
  .use(express.static(path.join(__dirname, "../public")))
  .use(express.json())
  .use(express.urlencoded( { extended: true }))
  .set("views", path.join(__dirname, "../views"))
  .set("view engine", "ejs")
  .use("/", indexRouter)
  .use(resumeRouter)
  .use('/user',userAuthRouter)
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
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
