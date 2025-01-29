const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require("./db");

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
