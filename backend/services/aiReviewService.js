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
You are an expert JavaScript reviewer.

Return ONLY valid JSON.

{
  "overview":"",
  "issues":[
    {
      "title":"",
      "explanation":"",
      "severity":"",
      "line":0
    }
  ],
  "suggestions":[],
  "improvedCode":""
}

Review this JavaScript code:

${code}

Static Findings:

${JSON.stringify(staticAnalysis.findings)}
`;

  const MAX_RETRIES = 1;

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