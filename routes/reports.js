import express from "express";
import pool from "../db.js";
import { analyzeCode } from "../services/aiService.js";

const router = express.Router();

// Generate a report for a repository
router.post("/generate", async (req, res) => {
  const { milestoneId, repoUrl, criteria } = req.body;
  console.log("trying to generate report");
  try {
    // Analyze the repository code using AI
    const analysis = await analyzeCode(repoUrl, criteria);
    console.log("****analysis****\n", analysis);

    // Create a new report
    const reportResult = await pool.query(
      "INSERT INTO reports (milestone_id, repo_url, evaluation) VALUES ($1, $2, $3) RETURNING *",
      [milestoneId, repoUrl, analysis.analysis]
    );

    const report = reportResult.rows[0];

    // Create checkpoints for each criterion
    const checkpointPromises = criteria.map(async (criterion) => {
      const pass = analysis.criteria[criterion.id]; // Assume this is a boolean
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

export default router;
