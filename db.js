const { Pool } = require("pg");

const pool = new Pool({
  user: "paulgasbarra",
  host: "localhost",
  database: "progress_tracker",
  password: "password",
  port: 5432,
});

module.exports = pool;
