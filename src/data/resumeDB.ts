import { getPool } from "./util";

import { JSDOM } from "jsdom";

const pool = getPool();

type SharedUser = {
  user_id: number,
  perms: string
}

class Resume {
  id: number = -1;
  user_id: number = -1;
  shared_users: string[] = [];
  title: string = "";
  html: string = "";

  public getAsHtmlElement(): Document {
    const html = this.html.trim();
    const dom = new JSDOM(html);

    return dom.window.document;
  }
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
  let sql = `INSERT INTO resumes (user_id, title, html, shared_users)
    VALUES ($1, $2, $3, $4)`;
  await pool.query(sql, [resume.user_id, resume.title, resume.html, []]);
}

const update = async (resume: Resume) => {
  const sql = `UPDATE resumes
    SET title = $1, html = $2, shared_users = $3
    WHERE id = $4`;
  await pool.query(sql, [resume.title, resume.html, resume.shared_users, resume.id]);
}

const getResumeByUserId = async (user_id: number): Promise<Resume[]> => {
  let result = await pool.query(`SELECT * FROM resumes
    WHERE user_id = $1;`, [user_id]);
  return result.rows;
}

const ResumeDB = {
  get,
  getAll,
  insert,
  update,
  getResumeByUserId,
}

export { Resume, ResumeDB, SharedUser };
