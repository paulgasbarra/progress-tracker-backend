const express = require("express");
const router = express.Router();
const pool = require("../db");
const { analyzeCode } = require("../services/aiService"); // Assume this is your AI service

// Generate a report for a repository
router.post("/generate", async (req, res) => {
  const { milestoneId, repoId, criteria } = req.body;
  console.log("Received request with:", { milestoneId, repoId, criteria });
  try {
    // Analyze the repository code using AI
    const analysis = await analyzeCode(repoId);

    // Create a new report
    const reportResult = await pool.query(
      "INSERT INTO reports (milestone_id, repo_id, evaluation) VALUES ($1, $2, $3) RETURNING *",
      [milestoneId, repoId, analysis.evaluation]
    );
    const report = reportResult.rows[0];

    // Create checkpoints for each criterion
    const checkpointPromises = criteria.map(async (criterion) => {
      const pass = analysis.criteriaResults[criterion.id]; // Assume this is a boolean
      return pool.query(
        "INSERT INTO checkpoints (criteria_id, report_id, pass) VALUES ($1, $2, $3) RETURNING *",
        [criterion.id, report.id, pass]
      );
    });

    const checkpoints = await Promise.all(checkpointPromises);

    res.json({ report, checkpoints });
  } catch (err) {
    console.error("Error generating report:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
