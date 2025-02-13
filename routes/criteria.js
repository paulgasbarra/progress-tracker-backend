import express from "express";
import pool from "../db.js";

const router = express.Router();

// Create a new criteria
router.post("/", async (req, res) => {
  const { title, milestone_id } = req.body;
  try {
    const newCriteria = await pool.query(
      "INSERT INTO criteria (title, milestone_id) VALUES ($1, $2) RETURNING *",
      [title, milestone_id]
    );
    res.status(201).json(newCriteria.rows[0]);
  } catch (err) {
    console.error("Error creating criteria:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update an existing criteria
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedCriteria = await pool.query(
      "UPDATE criteria SET title = $1 WHERE id = $2 RETURNING *",
      [title, id]
    );
    if (updatedCriteria.rows.length === 0) {
      return res.status(404).json({ error: "Criteria not found" });
    }
    res.json(updatedCriteria.rows[0]);
  } catch (err) {
    console.error("Error updating criteria:", err.message);
    res.status(500).send("Server Error");
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM criteria WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting criteria:", err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
