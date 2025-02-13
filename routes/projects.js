import express from "express";
const router = express.Router();

import pool from "../db.js";

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

// Get a single project by ID with milestones and criteria
router.get("/:id", async (req, res) => {
  console.log("Fetching project with ID:", req.params.id);
  const { id } = req.params;
  try {
    const projectResult = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id]
    );

    const milestonesResult = await pool.query(
      "SELECT m.*, pm.project_id FROM milestones m JOIN project_milestones pm ON m.id = pm.milestone_id WHERE pm.project_id = $1",
      [id]
    );

    const milestones = await Promise.all(
      milestonesResult.rows.map(async (milestone) => {
        const criteriaResult = await pool.query(
          "SELECT * FROM criteria WHERE milestone_id = $1",
          [milestone.id]
        );
        return { ...milestone, criteria: criteriaResult.rows };
      })
    );

    const project = projectResult.rows[0];
    project.milestones = milestones;

    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err.message);
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

// Get milestones for a project with criteria
router.get("/:projectId/milestones", async (req, res) => {
  const { projectId } = req.params;
  try {
    const milestonesResult = await pool.query(
      `SELECT m.id, m.title, json_agg(c.*) as criteria
       FROM milestones m
       LEFT JOIN criteria c ON m.id = c.milestone_id
       JOIN project_milestones pm ON m.id = pm.milestone_id
       WHERE pm.project_id = $1
       GROUP BY m.id`,
      [projectId]
    );
    res.json(milestonesResult.rows);
  } catch (err) {
    console.error("Error fetching milestones for project:", err.message);
    res.status(500).send("Server Error");
  }
});

// Add a milestone to a project
router.post("/:projectId/milestones/:milestoneId", async (req, res) => {
  console.log("Adding milestone to project");
  const { projectId, milestoneId } = req.params;
  try {
    // Use the junction table to associate projects and milestones
    await pool.query(
      "INSERT INTO project_milestones (project_id, milestone_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [projectId, milestoneId]
    );

    // Fetch the updated project with milestones
    const projectResult = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [projectId]
    );

    const milestonesResult = await pool.query(
      "SELECT m.*, pm.project_id FROM milestones m JOIN project_milestones pm ON m.id = pm.milestone_id WHERE pm.project_id = $1",
      [projectId]
    );

    const milestones = await Promise.all(
      milestonesResult.rows.map(async (milestone) => {
        const criteriaResult = await pool.query(
          "SELECT * FROM criteria WHERE milestone_id = $1",
          [milestone.id]
        );
        return { ...milestone, criteria: criteriaResult.rows };
      })
    );

    const project = projectResult.rows[0];
    project.milestones = milestones;

    res.json(project);
  } catch (err) {
    console.error("Error adding milestone to project:", err.message);
    res.status(500).send("Server Error");
  }
});

// Remove a milestone from a project
router.delete("/:projectId/milestones/:milestoneId", async (req, res) => {
  const { projectId, milestoneId } = req.params;
  try {
    await pool.query(
      "DELETE FROM project_milestones WHERE project_id = $1 AND milestone_id = $2",
      [projectId, milestoneId]
    );

    // Fetch the updated project with milestones
    const projectResult = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [projectId]
    );

    const milestonesResult = await pool.query(
      "SELECT m.*, pm.project_id FROM milestones m JOIN project_milestones pm ON m.id = pm.milestone_id WHERE pm.project_id = $1",
      [projectId]
    );

    const milestones = await Promise.all(
      milestonesResult.rows.map(async (milestone) => {
        const criteriaResult = await pool.query(
          "SELECT * FROM criteria WHERE milestone_id = $1",
          [milestone.id]
        );
        return { ...milestone, criteria: criteriaResult.rows };
      })
    );

    const project = projectResult.rows[0];
    project.milestones = milestones;

    res.json(project);
  } catch (err) {
    console.error("Error removing milestone from project:", err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
