import { getPool } from "./util";

const pool = getPool();

type User = {
  id: number,
  name: string,
  username: string,
  password_hash: string,
  salt: string
};

const getAllUsers = async (): Promise<User[]> => {
  let users: User[];
  let result = await pool.query('SELECT * FROM users;');
  users = result.rows;
  return users;
}

const insertNewUser = async (name: string, username: string, password_hash: string, salt: string): Promise<User> => {
  let user: User;
  let result = await pool.query(`INSERT INTO users (name, username, password, salt) 
    VALUES ($1, $2, $3, $4) RETURNING *;`, [name, username, password_hash, salt]);
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
