const pool = require("./db");
const bcrypt = require("bcrypt");

const addAdmin = async () => {
  const email = "paul@gmail.org";
  const password = "admin123";

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await pool.query(
      "INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, password_hash]
    );

    console.log("Admin added:", result.rows[0]);
  } catch (err) {
    console.error("Error adding admin:", err);
  } finally {
    pool.end();
  }
};

addAdmin();
