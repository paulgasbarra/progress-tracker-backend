import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: "paulgasbarra",
  host: "localhost",
  database: "progress_tracker",
  password: "password",
  port: 5432,
});

export default pool;
