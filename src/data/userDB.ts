import { getPool } from "./util";

const pool = getPool();

export type User = {
  id: number,
  name: string,
};

const getAllUsers = async () => {
  let users: User[];
  let result = await pool.query('SELECT * FROM users;');
  users = result.rows;
  return users;
}

const UserDB = {
  getAllUsers
}

export default UserDB;
