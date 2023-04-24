import express, {Request, Response} from "express";
import Data from "../data/index";
import bcrypt from "bcryptjs";
const router = express.Router();
import { verifyUser } from "../auth/auth";
import jwt from "jsonwebtoken";

router.post("/authenticate", async (req: Request, res: Response) => {
  try {
    const {username, password} = req.body;
    if (username && password) {
      let userID = await verifyUser(username, password);
      if (userID && process.env.JWT_SECRET) {
        const accessToken = jwt.sign({id: userID, username}, process.env.JWT_SECRET,
          {expiresIn: process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : "1h"});
        res.status(200).json({success: true, msg: "User Logged In"}).cookie('authorization','Bearer ' +
          accessToken, {httpOnly: true, secure: true});
      } else {
        res.status(401).json({success: false, msg: "Invalid credentials"});
      }
    } else {
      res.status(400).json({success: false, msg: "Invalid request"});
    }
  }
  catch (err) {
    console.log(err);
    res.status(503).json({success: false, msg: "Error authenticating user"});
  }
})
  .post("/register", async (req: Request, res: Response) => {
    try {
      const {first_name, last_name, username, password} = req.body;
      if (first_name && last_name && username && password) {
        const salt = await bcrypt.genSalt(process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await Data.Users.insertNewUser(first_name, last_name, username, passwordHash, salt);
        if (user && process.env.JWT_SECRET) {
          const accessToken = jwt.sign({id: user.id, username}, process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : "1h"});
          res.status(201).json({success: true, msg: "User created"}).cookie('authorization', 'Bearer ' +
            accessToken, {httpOnly: true, secure: true});
        } else {
          res.status(400).json({success: false, msg: "Invalid request"});
        }
      } else {
        res.status(400).json({success: false, msg: "Invalid request"});
      }
    } catch (err) {
      console.log(err);
      res.status(503).json({success: false, msg: "Error registering user"});
    }
  });

export default router;
