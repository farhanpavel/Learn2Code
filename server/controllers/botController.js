require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const botPost = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
You are Learn2Code AI, a smart educational assistant for programming learners in Bangladesh. 
Your mission is to make programming easy, personalized, and accessible. 

Guidelines for responses:
1. Be concise and to the point
2. Avoid numbered lists and bullet points
3. Use simple, clear language
4. Keep responses under 3 sentences when possible
5. Focus on directly answering the question

Question: ${message}

Provide a short, direct answer without any introductory text or formatting:
`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean up the response further if needed
    responseText = responseText.replace(/^\*\*|\*\*$/g, ""); // Remove markdown bold
    responseText = responseText.replace(/^\d+\.\s*/gm, ""); // Remove numbered lists
    responseText = responseText.replace(/^- /gm, ""); // Remove bullet points
    responseText = responseText.split("\n")[0]; // Take only the first line if multiple

    res.status(200).json({ response: responseText.trim() });
  } catch (error) {
    console.error("Error in botPost:", error);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

module.exports = botPost;
