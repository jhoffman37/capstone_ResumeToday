import { getPool } from "./util";

const pool = getPool();

type User = {
  id: number,
  first_name: string,
  last_name: string,
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

const insertNewUser = async (first_name: string, last_name: string, username: string, password_hash: string, salt: string): Promise<User> => {
  let user: User;
  if (!await checkUserExists(username)) {
    let result = await pool.query(`INSERT INTO users (first_name, last_name, username,
                                                      password_hash, salt)
                                   VALUES ($1, $2, $3, $4, $5)
                                   RETURNING *;`, [first_name, last_name, username, password_hash, salt]);
    user = result.rows[0];
    return user;
  } else {
    throw 'UserAlreadyExists';
  }
}

const getUserByUsername = async (username: string): Promise<any> => {
  let user: User;
  let result = await pool.query('SELECT * FROM users WHERE username=$1;', [username]);
  user = result.rows[0];
  if (user) {
    return user;
  } else {
    throw 'UserNotFound';
  }
}

const getUserById = async (id: Number): Promise<any> => {
  let user: User;
  let result = await pool.query('SELECT * FROM users WHERE id=$1;', [id]);
  user = result.rows[0];
  if (user) {
    return user;
  } else {
    throw 'UserNotFound';
  }
}

const checkUserExists = async (username: string): Promise<boolean> => {
  let result = await pool.query('SELECT * FROM users WHERE username=$1;', [username]);
  return result.rows.length > 0;
}

const UserDB = {
  getAllUsers,
  getUserByUsername,
  getUserById,
  insertNewUser,
  checkUserExists
}

export { User, UserDB };
