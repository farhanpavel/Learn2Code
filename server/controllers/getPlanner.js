require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const getGeneratedPlan = async (req, res) => {
  try {
    const { query } = req.body;

    // Validate input
    if (!query) {
      return res
        .status(400)
        .json({ error: "Please enter a query to get a plan" });
    }

    const inputPrompt = `I want to learn ${query}. give me a roadmap to learn it. give me a json object where there will be an array of objects. each object will have a title and a description. the title will be the name of the course and the description will be the description of the course. the courses should be in order of learning. the first course should be the most basic and the last course should be the most advanced.`;

    const response = await model.generateContent(inputPrompt);

    res.status(200).json({ result: response.response.text() });
  } catch (error) {
    console.error("Error generating response from AI:", error);
    res.status(500).json({ error: "Failed to generate response from AI." });
  }
};

module.exports = { getGeneratedPlan };
