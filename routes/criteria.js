const express = require("express");
const pool = require("../db");

const router = express.Router();

router.put("/api/criteria/:id", async (req, res) => {
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

router.delete("/api/criteria/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM criteria WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Criteria not found" });
    }
    res.json({ message: "Criteria deleted successfully" });
  } catch (err) {
    console.error("Error deleting criteria:", err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/api/criteria/:id", async (req, res) => {
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

module.exports = router;
