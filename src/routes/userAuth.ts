import express, {Request, Response} from "express";
import Data from "../data/index";
import bcrypt from "bcryptjs";
const router = express.Router();
import { verifyUser } from "../auth/auth";

router.post("/authenticate", async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body;
    if (username && password) {
      let result = await verifyUser(username, password);
    }
  }
  catch (err) {
    console.log(err);
    res.status(503).json({msg: "Error authenticating user"});
  }
})
  .post("/register", async (req: Request, res: Response) => {
    try {
      const {name, username, password} = req.body;
      if (name && username && password) {
        const salt = await bcrypt.genSalt(process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await Data.Users.insertNewUser(name, username, passwordHash, salt);
        if (user) {
          res.status(201).json({msg: "User created"});
        } else {
          res.status(400).json({msg: "Invalid request"});
        }
      } else {
        res.status(400).json({msg: "Invalid request"});
      }
    } catch (err) {
      console.log(err);
      res.status(503).json({msg: "Error registering user"});
    }
  });

export default router;
