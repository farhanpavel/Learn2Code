const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");
const { storeSchema } = require("../models/storeSchema");
const Store = mongoose.model("store", storeSchema);
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configure AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to generate summary from AI
const getSummaryFromAI = async (text) => {
  const inputPrompt = `Summarize the following text in a concise manner:
  ${text}`;

  try {
    // Request the AI model to generate content
    const response = await model.generateContent(inputPrompt);
    return response.response.text();
  } catch (error) {
    console.error("Error generating summary from AI:", error);
    throw new Error("Failed to generate summary from AI.");
  }
};

const extractData = async (req, res) => {
  const { pdfUrl } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: "Missing pdfUrl" });
  }

  try {
    // Fetch the PDF file from Cloudinary
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const buffer = await response.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(buffer));

    // Get the summary from AI
    const summary = await getSummaryFromAI(pdfData.text);

    // Store the summary in MongoDB
    const updatedStore = await Store.findOneAndReplace(
      {},
      { description: summary },
      { upsert: true, new: true }
    );

    // Return the summary response
    return res.status(200).json({
      message: "PDF summary extracted and stored",
      summary,
      updatedStore, // Optionally return the updated store document
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { extractData };
