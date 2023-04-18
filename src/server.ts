require("dotenv").config();
import express, {Request, Response} from "express";
import path from "path";
import { Pool } from "pg";

const PORT = process.env.PORT || 5163;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

express()
  .use(express.static(path.join(__dirname, "../public")))
  .use(express.json())
  .use(express.urlencoded( { extended: true }))
  .set("views", path.join(__dirname, "../views"))
  .set("view engine", "ejs")
  .get("/", async(req: Request, res: Response) => {
    res.render("pages/home.ejs")
  })
  .get("/health", async(req: Request, res: Response) => {
    if (pool) {
      let data = await pool.query('SELECT * FROM users')
      if (data.rows && data.rows.length > 0) {
        res.status(200).send('OK')
      } else {
        res.status(500).send('Error')
      }
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
