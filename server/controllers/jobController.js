const mongoose = require("mongoose");
const { jobSchema } = require("../models/jobSchema");
const { jobansSchema } = require("../models/jobanswerSchema");
const cloudinary = require("cloudinary").v2;
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");

const Job = mongoose.model("Job", jobSchema);
const JobAnswer = mongoose.model("JobAns", jobansSchema);

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configure AI model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateInterviewQuestions = async (
  jobTitle,
  description,
  summary,
  difficulty
) => {
  const inputPrompt = `Generate 5 interview questions for the job titled "${jobTitle}". The job description is: "${description}". The candidate's summary is: "${summary}". The difficulty level is: "${difficulty}". Please ask the questions directly using the candidate's name, without any additional text or explanation.`;

  try {
    const response = await model.generateContent(inputPrompt);
    const questionsText = response.response.text();

    // Split the generated text into individual questions
    const questionsArray = questionsText
      .split("\n") // Split by new lines
      .filter((q) => q.trim() !== "") // Remove empty lines
      .map((q) => {
        // Remove numbering (e.g., "1.", "2.", etc.) and parenthetical explanations
        return q
          .replace(/^\d+\.\s*/, "") // Remove numbering (e.g., "1. ")
          .replace(/\s*\([^)]*\)/g, ""); // Remove parenthetical explanations
      });
    // Map the questions to the jobQuestionSchema format
    const questions = questionsArray.map((q) => ({
      question: q,
      answer: "", // Initially, the answer is blank
    }));

    return questions;
  } catch (error) {
    console.error("Error generating interview questions:", error);
    throw new Error("Failed to generate interview questions.");
  }
};

const postResumeAndExtractSummary = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // Step 1: Upload file to Cloudinary
    const cloudinaryResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Auto-detect file type
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer); // Upload the file buffer
    });

    // Step 2: Fetch the uploaded PDF from Cloudinary and extract text
    const response = await fetch(cloudinaryResult.secure_url);
    if (!response.ok) {
      throw new Error("Failed to fetch PDF from Cloudinary.");
    }
    const buffer = await response.arrayBuffer();
    const pdfData = await pdfParse(Buffer.from(buffer));

    // Step 3: Generate summary from the extracted text using AI
    const summary = await getSummaryFromAI(pdfData.text);

    // Step 4: Generate interview questions
    const questions = await generateInterviewQuestions(
      req.body.jobTitle,
      req.body.description,
      summary,
      req.body.difficulty
    );
    await Job.deleteMany({});
    // Step 5: Create a new job document with the job title, description, summary, and questions
    const newJob = new Job({
      jobTitle: req.body.jobTitle,
      description: req.body.description,
      summary: summary,
      difficulty: req.body.difficulty,
      questions: questions, // Add the generated questions with blank answers
    });

    // Step 6: Save the job document to MongoDB
    await newJob.save();

    // Step 7: Send success response
    res.status(201).json({
      message:
        "Resume uploaded, summary extracted, and interview questions generated successfully.",
      data: newJob,
    });
  } catch (error) {
    console.error("Error in postResumeAndExtractSummary:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSummaryFromAI = async (text) => {
  const inputPrompt = `Summarize the following text specially write about the skills in a concise manner:
  ${text}`;

  try {
    const response = await model.generateContent(inputPrompt);
    return response.response.text();
  } catch (error) {
    console.error("Error generating summary from AI:", error);
    throw new Error("Failed to generate summary from AI.");
  }
};

const getResumeAndExtractSummary = async (req, res) => {
  try {
    const resume = await Job.findOne({});
    res.status(200).json(resume); // Use 200 for successful response
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const { id } = req.params; // ID of the question (not the Job)

    if (!answer) {
      return res.status(400).json({ error: "Answer is required." });
    }

    // Find the job that contains this question
    const job = await Job.findOne({ "questions._id": id });

    if (!job) {
      return res.status(404).json({ error: "Question not found in any job." });
    }

    // Find the specific question inside the array
    const question = job.questions.find((q) => q._id.toString() === id);

    if (!question) {
      return res.status(404).json({ error: "Question not found." });
    }

    // Update the answer
    question.answer = answer;

    // Save the updated job document
    await job.save();

    res.status(200).json({
      message: "Answer updated successfully.",
      data: question,
    });
  } catch (error) {
    console.error("Error updating answer:", error);
    res.status(500).json({ error: error.message });
  }
};
const evaluateAnswersWithAI = async (summary, questions) => {
  const inputPrompt = `Evaluate the following interview answers based on the candidate's summary and provide a mark out of 10 along with some suggestions for improvement:
  
  Candidate Summary:
  ${summary}
  
  Questions and Answers:
  ${questions
    .map((q, index) => `${index + 1}. ${q.question}\nAnswer: ${q.answer}`)
    .join("\n\n")}
    
  Please provide the evaluation in the following JSON format:
  {
    "marks": <mark out of 10>,
    "suggestions": "<short suggestions for improvement in just two lines>"
  }`;

  try {
    const response = await model.generateContent(inputPrompt);
    const evaluationText = response.response.text();

    // Clean up any unwanted characters or markdown that might have been included in the AI response
    const cleanText = evaluationText.replace(/```json|```|```/g, "").trim(); // Remove any markdown code block syntax

    // Replace answer numbers with line breaks and clean up other formatting
    const formattedText = cleanText.replace(/Answer \d+:/g, "\nAnswer:");

    // Parse the cleaned evaluation text to extract marks and suggestions
    const evaluation = JSON.parse(formattedText);
    return evaluation;
  } catch (error) {
    console.error("Error evaluating answers with AI:", error);
    throw new Error("Failed to evaluate answers with AI.");
  }
};

const storeEvaluationData = async (req, res) => {
  try {
    const job = await Job.findOne();

    if (!job) {
      throw new Error("Job not found.");
    }

    // Step 2: Get the summary and questions from the job
    const { summary, questions } = job;

    // Step 3: Call the evaluateAnswersWithAI function
    const evaluation = await evaluateAnswersWithAI(summary, questions);

    // Step 4: Create the evaluation data to be stored
    const evaluationData = {
      mark: evaluation.marks,
      suggestion: evaluation.suggestions,
    };
    await JobAnswer.deleteMany({});
    // Step 5: Save the evaluation data into the JobAnswer collection
    const newJobAnswer = new JobAnswer(evaluationData);
    await newJobAnswer.save();

    res.status(200).json({
      message: "Answer updated successfully.",
      data: newJobAnswer,
    });
  } catch (error) {
    console.error("Error storing evaluation data:", error);
    throw new Error("Failed to store evaluation data.");
  }
};
const getStorejob = async (req, res) => {
  const data = await JobAnswer.findOne({});
  res.status(200).json(data);
};
module.exports = {
  postResumeAndExtractSummary,
  getResumeAndExtractSummary,
  updateAnswer,
  storeEvaluationData,
  getStorejob,
};
