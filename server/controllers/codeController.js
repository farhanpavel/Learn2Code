require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { get } = require("mongoose");

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
      text: "Provide a short review for the given code..provide corrections and suggestions in 3 to 4 line",
    },
  ],
};
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: generationConfig,
  systemInstruction: systemInstruction,
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

const getVideos = async (req, res) => {
  try {
    const { pl, lang } = req.query;
    if (!pl || !lang) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const url = `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(
      pl
    )}%20tutorial%20in%20${lang}&hl=en&gl=US`;
    console.log(url);
    //return res.status(200).json({ url });
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "youtube138.p.rapidapi.com",
      },
    };
    const response = await fetch(url, options);
    const result = await response.json();

    res.status(200).json(result);
  } catch (error) {
    console.error("Error generating response from AI:", error);
    res.status(500).json({ error: "Failed to generate response from AI." });
  }
};

module.exports = { getCodeReview, getVideos };
