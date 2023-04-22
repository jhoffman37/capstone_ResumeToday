import { getPool } from "./util";

const pool = getPool();

type User = {
  id: number,
  name: string,
  username: string,
  password: string,
};

const getAllUsers = async (): Promise<User[]> => {
  let users: User[];
  let result = await pool.query('SELECT * FROM users;');
  users = result.rows;
  return users;
}

const UserDB = {
  getAllUsers
}

export { User, UserDB };
