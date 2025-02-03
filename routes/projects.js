const express = require("express");
const router = express.Router();

const pool = require("../db");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).send("Server Error");
  }
});

// Create a new project
router.post("/", async (req, res) => {
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

// Update a project
router.put("/:id", async (req, res) => {
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

// Get milestones for a project
router.get("/:id/milestones", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM milestones WHERE project_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching milestones:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
