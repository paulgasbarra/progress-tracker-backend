import express from "express";
const router = express.Router();
import pool from "../db.js";

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM milestones");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching milestones:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM milestones WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching milestone:", err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE milestones SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating milestone:", err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM milestones WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    res.json({ message: "Milestone deleted successfully" });
  } catch (err) {
    console.error("Error deleting milestone:", err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/:milestoneId/criteria", async (req, res) => {
  const { milestoneId } = req.params;
  const { title } = req.body;
  try {
    const newCriteria = await pool.query(
      "INSERT INTO criteria (title, milestone_id) VALUES ($1, $2) RETURNING *",
      [title, milestoneId]
    );
    res.status(201).json(newCriteria.rows[0]);
  } catch (err) {
    console.error("Error creating criteria:", err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/:id/criteria", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM criteria WHERE milestone_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching criteria:", err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", async (req, res) => {
  console.log("Creating milestone");
  const { title, description } = req.body;
  try {
    const newMilestone = await pool.query(
      "INSERT INTO milestones (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(newMilestone.rows[0]);
  } catch (err) {
    console.error("Error creating milestone:", err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
