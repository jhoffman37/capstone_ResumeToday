import { getPool } from "./util";

const pool = getPool();

type User = {
  id: number,
  name: string,
  username: string,
  password: string,
  salt: string
};

const getAllUsers = async (): Promise<User[]> => {
  let users: User[];
  let result = await pool.query('SELECT * FROM users;');
  users = result.rows;
  return users;
}

const insertNewUser = async (name: string, username: string, password: string): Promise<User> => {
  let user: User;
  let result = await pool.query('INSERT INTO users (name, username, password) VALUES ($1, $2, $3) RETURNING *;', [name, username, password]);
  user = result.rows[0];
  return user;
}

const getUserByUsername = async (username: string): Promise<User> => {
  let user: User;
  let result = await pool.query('SELECT * FROM users WHERE username=$1;', [username]);
  user = result.rows[0];
  return user;
}

const UserDB = {
  getAllUsers,
  getUserByUsername,
  insertNewUser
}

export { User, UserDB };
