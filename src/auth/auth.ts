import {NextFunction} from "express";
import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Data from "../data";

type AuthUser = {
  id: number;
  username: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: AuthUser;
  }
}

export const authenticateToken =  async (req: Request, res: Response, next: NextFunction) => {
const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  if (process.env.ACCESS_TOKEN_SECRET) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user as AuthUser;
      next();
    });
  }
}

//Returns a user id if the user is in the database, otherwise returns null
export const verifyUser = async (username: string, password: string) => {
  let users = await Data.Users.getUsersByUsername(username);
  for (const user of users) {
    const valid = await bcrypt.compare(password, user.password_hash);
    if (valid) {
      return user.id;
    }
  }
  return null;
}
