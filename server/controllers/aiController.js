require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_mime_type: "text/plain",
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const getPdfAnalysis = async (req, res) => {
  try {
    const { fullPdfText, selectedLine } = req.body;

    // Validate input
    if (!fullPdfText || !selectedLine) {
      return res
        .status(400)
        .json({ error: "PDF text and selected line are required." });
    }

    const inputPrompt = `I will give you all the text from a PDF, and with that, I will provide a line from the PDF that I cannot understand. Now you need to tell me what this line actually means according to the context of the PDF also give me ans in 4 line .
PDF Text: ${fullPdfText}
Selected Line: ${selectedLine}`;

    const response = await model.generateContent(inputPrompt);

    res.status(200).json({ result: response.response.text() });
  } catch (error) {
    console.error("Error generating response from AI:", error);
    res.status(500).json({ error: "Failed to generate response from AI." });
  }
};

module.exports = { getPdfAnalysis };
