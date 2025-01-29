const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
const pool = require("./db");
const bcrypt = require("bcrypt");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, PERN stack!");
});

app.get("/admins", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM admins");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/admins/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newAdmin = await pool.query(
      "INSERT INTO admins (email, password_hash) VALUES ($1, $2) RETURNING *",
      [email, password_hash]
    );

    res.status(201).json(newAdmin.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
