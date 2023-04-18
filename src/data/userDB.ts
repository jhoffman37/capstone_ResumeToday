import { getPool } from "./util";

const pool = getPool();

const getAllUsers = async () => {
  let result = await pool.query('SELECT * FROM users;')
  return result.rows;
}

const UserDB = {
  getAllUsers
}

export default UserDB;
