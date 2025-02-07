require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const getGeneratedPlan = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate input
    if (!query) {
      return res
        .status(400)
        .json({ error: "Please enter a query to get a plan" });
    }

    // Adjusted prompt to include references (docs & YouTube)
    const inputPrompt = `Give me a roadmap for ${query}. 
    Return a JSON array where each element is an object with:
    - step: A specific learning step.
    - difficulty: The difficulty level (Beginner, Intermediate, Advanced).
    - reference_links: An array of objects containing:
      - title: The title of the reference.
      - url: The URL of the reference.
      - type: Either "documentation" or "video" (for YouTube links).
    
    Respond with JSON only, no explanations or markdown formatting.`;

    const response = await model.generateContent(inputPrompt);

    // Extract response text
    let responseText = response.response.text().trim();

    // Clean the response: Remove triple backticks and `json` labels if present
    responseText = responseText.replace(/```json|```/g, "").trim();

    // Attempt to parse the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    res.status(200).json({ result: jsonResponse });
  } catch (error) {
    console.error("Error generating response from AI:", error);
    res.status(500).json({ error: "Failed to generate response from AI." });
  }
};

module.exports = { getGeneratedPlan };
