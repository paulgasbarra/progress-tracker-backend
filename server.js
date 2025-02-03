const cors = require("cors");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;

const adminsRouter = require("./routes/admins");
const projectsRouter = require("./routes/projects");
const milestonesRouter = require("./routes/milestones");
const criteriaRouter = require("./routes/criteria");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Progress Tracker API");
});

app.use("/api/admins", adminsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/milestones", milestonesRouter);
app.use("/api/criteria", criteriaRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
