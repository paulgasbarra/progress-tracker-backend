import cors from "cors";
import express from "express";
const app = express();
const PORT = process.env.PORT || 5001;

import adminsRouter from "./routes/admins.js";
import projectsRouter from "./routes/projects.js";
import milestonesRouter from "./routes/milestones.js";
import criteriaRouter from "./routes/criteria.js";
import reportsRouter from "./routes/reports.js";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Progress Tracker API");
});

app.use("/api/admins", adminsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/milestones", milestonesRouter);
app.use("/api/criteria", criteriaRouter);
app.use("/api/reports", reportsRouter);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
