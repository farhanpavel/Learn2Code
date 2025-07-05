const mongoose = require("mongoose");
const { ansSchema } = require("../models/ansSchema");
const { storeSchema } = require("../models/storeSchema");
const { questionSchema } = require("../models/questionSchema");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { resultSchema } = require("../models/resultSchema");
const Store = mongoose.model("store", storeSchema);
const Question = mongoose.model("question", questionSchema);
const Ans = mongoose.model("Ans", ansSchema);
const Result = mongoose.model("Result", resultSchema);
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//
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

const resultGet = async (req, res) => {
  const user_id = req.user.id;
  try {
    const latestStore = await Store.findOne().sort({ date: -1 });

    if (!latestStore) {
      return res.status(404).json({ message: "No summary found" });
    }

    const questions = await Question.find({
      user_id,
      title: req.params.title,
    });
    const answers = await Ans.find({
      user_id,
      title: req.params.title,
    });

    const answerMap = new Map();
    answers.forEach((ans) => {
      answerMap.set(ans.id.toString(), ans.answer);
    });

    const combinedData = questions.map((q) => ({
      id: q._id,
      question: q.theoryquestion,
      ans: answerMap.get(q._id.toString()) || "I do not know",
    }));

    const aiInput = {
      summary: latestStore.description,
      data: combinedData,
    };

    const aiResponse = await getAIResponse(aiInput);

    const finalResult = aiResponse.map((aiItem) => {
      const matchingData = combinedData.find(
        (item) => item.id.toString() === aiItem._id.toString()
      );

      return {
        ...aiItem,
        question: matchingData?.question || "Unknown question",
        answer: matchingData?.ans || "Unknown answer",
      };
    });
    const resultData = finalResult.map((item) => ({
      id: item._id, // Assuming _id is the question ID or some unique identifier
      question: item.question,
      ans: item.answer,
      correctness: item.correctness,
      comment: item.comment,
      user_id,
      title: req.params.title,
    }));
    console.log(resultData);
    await Result.insertMany(resultData);
    res.status(200).json(finalResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getAIResponse = async (data) => {
  const inputPrompt = `
    Based on the following summary: 
    "${data.summary}"
  
    Evaluate the answers given for the corresponding questions.
    Provide a JSON response with:
    - _id (matching the question)
    - comment (feedback on the answer)
    - correctness (choose from 0%, 25%, 50%, 75%, 100%)
    - original answer (rephrase it in two lines)
  
    Here are the questions and answers:
    ${JSON.stringify(data.data, null, 2)}
    `;

  try {
    const response = await model.generateContent(inputPrompt);
    const rawText = response.response.text();

    const jsonMatch = rawText.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error("AI response is not in valid JSON format.");

    const cleanJson = jsonMatch[0];
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    throw new Error("Failed to evaluate answers using AI.");
  }
};

module.exports = { resultGet, extractData };
