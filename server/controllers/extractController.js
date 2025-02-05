const mongoose = require("mongoose");
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");
const { storeSchema } = require("../models/storeSchema");
const { questionSchema } = require("../models/questionSchema");
const Store = mongoose.model("store", storeSchema);
const Question = mongoose.model("question", questionSchema);
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
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const buffer = await response.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(buffer));

    const summary = await getSummaryFromAI(pdfData.text);

    const updatedStore = await Store.findOneAndReplace(
      {},
      { description: summary },
      { upsert: true, new: true }
    );

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
  const { pdfUrl } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: "Missing pdfUrl" });
  }

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF");
    }

    const buffer = await response.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(buffer));

    const summary = await getSummaryFromAI(pdfData.text);
    const questionData = await getQuestionFromAI(summary);

    if (!Array.isArray(questionData) || questionData.length === 0) {
      throw new Error("Invalid format: Expected an array of questions");
    }

    await Question.deleteMany({});

    const questionDocs = questionData.map((q) => ({
      theoryquestion: q.theoryquestion,
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
  try {
    const pdfs = await Question.find();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { extractData, questionData, questionGet };
