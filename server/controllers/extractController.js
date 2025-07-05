const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");
const { storeSchema } = require("../models/storeSchema");
const { questionSchema } = require("../models/questionSchema");
const Store = mongoose.model("store", storeSchema);
const Question = mongoose.model("question", questionSchema);
const { pdfSchema } = require("../models/pdfSchema");
const Pdf = mongoose.model("pdf", pdfSchema);
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configure AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Function to generate summary from AI
const getSummaryFromAI = async (text) => {
  const inputPrompt = `Summarize the following text contain all the major topics:
  ${text}`;

  try {
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
    console.log("Extracting text using PDF.co API...");
    const extractedText = await extractWithPDFCo(pdfUrl);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the PDF");
    }

    console.log("Text extracted successfully, generating summary...");
    const summary = await getSummaryFromAI(extractedText);

    console.log("Updating database...");
    const updatedStore = await Store.findOneAndReplace(
      {},
      { description: summary },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "PDF summary extracted and stored",
      summary,
      updatedStore,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return res.status(500).json({
      error: error.message || "Internal Server Error",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// PDF.co API integration
async function extractWithPDFCo(pdfUrl) {
  const API_KEY = process.env.OCR_API_KEY;
  const API_ENDPOINT = "https://api.pdf.co/v1/pdf/convert/to/text";

  try {
    console.log("Sending PDF to PDF.co API...");
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        url: pdfUrl,
        language: "eng", // Set to English for text recognition
        async: false, // Synchronous processing

        inline: true, // Return text directly
      }),
    });

    const result = await response.json();

    // Log the full API response for debugging
    console.log("PDF.co API Response:", JSON.stringify(result, null, 2));

    if (result.error) {
      throw new Error(result.message || "PDF.co API error");
    }

    if (!result.body || result.body.trim().length === 0) {
      throw new Error("PDF.co returned empty text");
    }

    return result.body;
  } catch (error) {
    console.error("PDF.co API Error:", error);
    throw new Error(`PDF.co processing failed: ${error.message}`);
  }
}

const getQuestionFromAI = async (text) => {
  const inputPrompt = `Based on the following passage, generate some theoretical questions:
  ${text}

  Please format your response as a JSON array of objects, where each object has a key "theoryquestion". Example:
  [
    { "theoryquestion": "What is the main idea of the passage?" },
    { "theoryquestion": "What are the key arguments presented?" },
    { "theoryquestion": "How does the passage explain the concept of X?" }
  ]`;

  try {
    const response = await model.generateContent(inputPrompt);
    const responseText = response.response.text();

    const jsonString = responseText.replace(/```json\n|\n```/g, "").trim();

    const questions = JSON.parse(jsonString);
    return questions;
  } catch (error) {
    console.error("Error generating questions from AI:", error);
    throw new Error("Failed to generate questions from AI.");
  }
};

const questionData = async (req, res) => {
  const { pdfUrl, title } = req.body;
  const user_id = req.user.id;

  if (!pdfUrl) {
    return res.status(400).json({ error: "Missing pdfUrl" });
  }

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }
    await Pdf.updateOne(
      { userId: user_id, Booktopic: title },
      { $set: { status: "1" } }
    );
    // const buffer = await response.arrayBuffer();
    // const pdfData = await pdfParse(Buffer.from(buffer));

    const summary = await Store.findOne();
    const questionData = await getQuestionFromAI(summary.description);

    if (!Array.isArray(questionData) || questionData.length === 0) {
      throw new Error("Invalid format: Expected an array of questions");
    }

    const questionDocs = questionData.map((q) => ({
      theoryquestion: q.theoryquestion,
      title,
      user_id,
    }));

    await Question.insertMany(questionDocs);

    return res.status(200).json({
      message: "Previous questions deleted. New questions stored successfully.",
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const questionGet = async (req, res) => {
  const userId = req.user.id;
  try {
    const pdfs = await Question.find({
      user_id: userId,
      title: req.params.title,
    });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { extractData, questionData, questionGet };
