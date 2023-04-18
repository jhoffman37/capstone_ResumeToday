import { Pool } from "pg";

export const getPool = function() {
  return new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
}
