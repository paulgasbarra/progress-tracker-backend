require("dotenv").config();
const axios = require("axios");

async function analyzeCode(repoId, criteria) {
  // Fetch the code from the repository
  const code = await fetchCodeFromRepo(repoId);

  // Create a prompt for the AI
  const prompt = createPrompt(code, criteria);

  // Send the prompt to the AI service for analysis
  const response = await axios.post(process.env.AI_API_URL, {
    prompt,
    apiKey: process.env.AI_API_KEY,
  });

  // Process the response to extract evaluation and criteria results
  const evaluation = response.data.evaluation;
  const criteriaResults = response.data.criteriaResults;

  return { evaluation, criteriaResults };
}

function createPrompt(code, criteria) {
  return `
    Analyze the following code and evaluate it based on the given criteria:
    Code: ${code}
    Criteria: ${criteria.map((c) => c.title).join(", ")}
    Provide a brief analysis and suggestions for improvement.
  `;
}

async function fetchCodeFromRepo(repoId) {
  // Implement logic to fetch code from the repository using repoId
  // This could involve cloning the repo or using an API to fetch the code
  return "code from repo";
}

module.exports = { analyzeCode };
