require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_mime_type: "text/plain",
};

const systemInstruction = {
    role: "model",
    parts: [
        {
            text: "Provide an in-depth code review as if you have 15 years of experience in computer science and IT. Kindly refuse to answer questions unrelated to the domain(this is a MUST). You have to provide feedback based on the code. For related questions, Offer explanations, code examples, and best practices similar to a StackOverflow response."
        }
    ]
};
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-pro-exp-02-05", 
    generationConfig: generationConfig, 
    systemInstruction: systemInstruction
});

const getCodeReview = async (req, res) => {
  try {
    const { code, language } = req.body;
    const inputPrompt = `language: ${language}\n code: ${code}`;

    const response = await model.generateContent(inputPrompt);

    res.status(200).json({ result: response.response.text() });
  } catch (error) {
    console.error("Error generating response from AI:", error);
    res.status(500).json({ error: "Failed to generate response from AI." });
  }
};

module.exports = { getCodeReview };
