import {NextFunction} from "express";
import {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Data from "../data";

export type AuthUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user: AuthUser;
  }
}

export const authenticateToken =  async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.cookies['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // `token` could be undefined or null, so check if it is either of those values
  if (!token) return next();
  if (process.env.JWT_SECRET) {
    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
      if (err) return next();
      req.user = user as AuthUser;
      next();
    });
  }
}

export const authenticateTokenStrict =  async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.cookies['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) return res.redirect('/login');
  if (process.env.JWT_SECRET) {
    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
      if (err) return res.redirect('/login');
      req.user = user as AuthUser;
      next();
    });
  }
}

//Returns a user id if the user is in the database, otherwise returns null
export const verifyUser = async (username: string, password: string) => {
  let user = await Data.Users.getUserByUsername(username);
  const valid = await bcrypt.compare(password, user.password_hash);
  if (valid) {
    return user.id;
  }
  return null;
}
