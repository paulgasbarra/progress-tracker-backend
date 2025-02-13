import dotenv from "dotenv";
import axios from "axios";
import fetchCodeFromRepo from "./fetchCode.js";
import OpenAI from "openai";

dotenv.config();

export async function analyzeCode(repoUrl, criteria) {
  const openai = new OpenAI({
    apiKey: process.env.AI_API_KEY,
  });
  // Fetch the code from the repository
  const code = await fetchCodeFromRepo(repoUrl);
  // Create a prompt for OpenAI
  const messages = createMessages(code, criteria);

  try {
    // Send the prompt to OpenAI for analysis
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
      top_p: 1,
      n: 1,
      stop: null,
    });

    // Log the response

    // Process the response to extract evaluation and criteria results
    if (response.choices && response.choices.length > 0) {
      const content = response.choices[0].message.content.trim();
      const parsedResponse = JSON.parse(content);

      // Ensure the response is in the expected format
      if (parsedResponse.analysis && Array.isArray(parsedResponse.criteria)) {
        return parsedResponse;
      } else {
        throw new Error("Unexpected response format");
      }
    } else {
      throw new Error("No choices returned in the response");
    }
  } catch (error) {
    console.error("Error generating report:", error.message);
    throw error;
  }
}

function createMessages(code, criteria) {
  return [
    {
      role: "system",
      content:
        "You are an expert software engineer reviewing a project built by a junior developer. You read code carefully, evaluate it based on given criteria, and return a structured JSON object. The object should have an 'analysis' field with a text summary and a 'criteria' field which is an array of objects. Each object in the 'criteria' array should have a 'text description' field and a 'pass' boolean field.",
    },
    {
      role: "user",
      content: `
      Analyze the following code and evaluate it based on the given criteria:

      Code: ${code}

      Criteria:
      ${criteria.map((c) => c.title).join(", ")}

      Provide a structured JSON object with your analysis and criteria evaluation.
      Share the index.js file and provide reasoning for your evaluation, point to specific lines of code that you are evaluating
      `,
    },
  ];
}
