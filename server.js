const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;
const pool = require("./db");
const bcrypt = require("bcrypt");

app.use(cors());
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

app.get("/api/admins", async (req, res) => {
  try {
    console.log("Getting admins");
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

app.post("/api/admins/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    if (admin.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.rows[0].password_hash
    );

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ email: admin.rows[0].email });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.post("/api/projects", async (req, res) => {
  const { name, description } = req.body;
  try {
    const newProject = await pool.query(
      "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
      [name, description]
    );
    res.status(201).json(newProject.rows[0]);
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const updatedProject = await pool.query(
      "UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, id]
    );
    if (updatedProject.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(updatedProject.rows[0]);
  } catch (err) {
    console.error("Error updating project:", err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
