import { getPool } from "./util";

import { JSDOM } from "jsdom";

const pool = getPool();

class Resume {
  id: number = -1;
  user_id: number = -1;
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
  let sql = `INSERT INTO resumes (user_id, title, html)
    VALUES ($1, $2, $3)`;
  await pool.query(sql, [resume.user_id, resume.title, resume.html]);
}

const update = async (resume: Resume) => {
  const sql = `UPDATE resumes
    SET title = $1, html = $2
    WHERE id = $3`;
  await pool.query(sql, [resume.title, resume.html, resume.id]);
}

const ResumeDB = {
  get,
  getAll,
  insert,
  update,
}

export { Resume, ResumeDB };