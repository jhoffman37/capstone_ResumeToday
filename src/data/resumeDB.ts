import { getPool } from "./util";

import { JSDOM } from "jsdom";

const pool = getPool();

class Resume {
  id: number = -1;
  user_id: number = -1;
  title: string = "";
  html: string = "";

  // Converts a string to an Html Element
  // "Borrowed" code from here 
  // https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro
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

const ResumeDB = {
  get,
  getAll,
  insert
}

export { Resume, ResumeDB };