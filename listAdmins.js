const pool = require("./db");

const listAdmins = async () => {
  try {
    const result = await pool.query("SELECT * FROM admins");
    console.log("Admins:", result.rows);
  } catch (err) {
    console.error("Error listing admins:", err);
  } finally {
    pool.end();
  }
};

listAdmins();
