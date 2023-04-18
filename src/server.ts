require("dotenv").config();
import express, {Request, Response} from "express";
import path from "path";
import Data from "./data";

const PORT = process.env.PORT || 5163;

const indexRouter = require("./routes/index");

express()
  .use(express.static(path.join(__dirname, "../public")))
  .use(express.json())
  .use(express.urlencoded( { extended: true }))
  .set("views", path.join(__dirname, "../views"))
  .set("view engine", "ejs")
  .use("/", indexRouter)
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
