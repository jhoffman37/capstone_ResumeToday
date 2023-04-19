import { getPool } from "./util";

const pool = getPool();

type Resume = {
  id: number,
  user_id: number,
  title: string,
  about: string,
};

const getAll = async (): Promise<Resume[]> => {
  let result = await pool.query('SELECT * FROM resumes;');
  return result.rows;
}

const get = async (id: number): Promise<Resume> => {
  let resume: Resume;
  let result = await pool.query(`SELECT * FROM resumes
    WHERE id = ${id};`);
  resume = result.rows[0];
  return resume;
}

const insert = async (resume: Resume) => {
  let sql = `INSERT INTO resumes (user_id, title, about)
    VALUES ($1, $2, $3)`;
  await pool.query(sql, [resume.user_id, resume.title, resume.about]);
}

const ResumeDB = {
  get,
  getAll,
  insert
}

export { Resume, ResumeDB };