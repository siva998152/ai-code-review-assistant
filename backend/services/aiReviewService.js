require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Wait helper
const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const reviewCodeWithAI = async (
  code,
  staticAnalysis
) => {
  const prompt = `
You are a senior JavaScript code reviewer.

Review the JavaScript code and static-analysis findings provided below.

Return ONLY valid JSON.
Do not use markdown code fences.
Do not include any explanation before or after the JSON.

Use exactly this structure:

{
  "overview": "Short overall assessment of the code",
  "issues": [
    {
      "title": "Issue title",
      "explanation": "Clear explanation of the issue",
      "severity": "error | warning | suggestion",
      "line": 1
    }
  ],
  "suggestions": [
    "Specific improvement suggestion"
  ],
  "improvedCode": "Complete improved JavaScript code"
}

If there are no issues return an empty issues array.
If there are no suggestions return an empty suggestions array.

JavaScript Code:

${code}

Static Analysis:

${JSON.stringify(staticAnalysis.findings, null, 2)}
`;

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `Gemini request (Attempt ${attempt}/${MAX_RETRIES})`
      );

      const response =
        await ai.models.generateContent({
          model: process.env.GEMINI_MODEL,
          contents: prompt,
        });

      let responseText = response.text?.trim();

      if (!responseText) {
        throw new Error(
          "Gemini returned an empty response."
        );
      }

      // Remove markdown code fences if present.
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const aiReview = JSON.parse(responseText);

      console.log("Gemini review generated.");

      return aiReview;
    } catch (error) {
      const status = error.status;

      console.error(
        `Gemini attempt ${attempt} failed.`,
        status || error.message
      );

      // Retry only for temporary errors.
      if (
        (status === 503 || status === 429) &&
        attempt < MAX_RETRIES
      ) {
        const waitTime = Math.pow(2, attempt) * 1000;

        console.log(
          `Retrying in ${waitTime / 1000} seconds...`
        );

        await delay(waitTime);

        continue;
      }

      // JSON parsing error
      if (error instanceof SyntaxError) {
        throw new Error(
          "Gemini returned invalid JSON."
        );
      }

      throw error;
    }
  }
};

module.exports = {
  reviewCodeWithAI,
};