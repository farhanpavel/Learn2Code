const { resultSchema } = require("../models/resultSchema");
const { questionSchema } = require("../models/questionSchema");
const { ansSchema } = require("../models/ansSchema");
const mongoose = require("mongoose");
const express = require("express");
const Result = mongoose.model("Result", resultSchema);
const { pdfSchema } = require("../models/pdfSchema");
const Pdf = mongoose.model("pdf", pdfSchema);
const Question = mongoose.model("question", questionSchema);
const Ans = mongoose.model("Ans", ansSchema);

const questionresultGet = async (req, res) => {
  const data = await Pdf.find({
    status: "1",
  });
  res.status(200).json(data);
};
const questionresultGetByid = async (req, res) => {
  const data = await Result.find({
    user_id: req.params.id,
    title: req.params.title,
  });
  res.status(200).json(data);
};
const questionresultDelete = async (req, res) => {
  try {
    // Delete documents from Question collection
    await Question.deleteMany({
      user_id: req.params.id, // Corrected typo: `ser_id` to `user_id`
      title: req.params.title,
    });

    // Delete documents from Ans collection
    await Ans.deleteMany({
      user_id: req.params.id, // Corrected typo: `ser_id` to `user_id`
      title: req.params.title,
    });

    // Update the Pdf collection: Find by user_id and title, then set status to 0
    await Pdf.updateOne(
      {
        Booktopic: req.params.title,
      },
      {
        $set: { status: "0" }, // Set status to 0
      }
    );

    const data = await Result.deleteMany({
      user_id: req.params.id,
      title: req.params.title,
    });

    // Send success response
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in questionresultDelete:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports = {
  questionresultGet,
  questionresultGetByid,
  questionresultDelete,
};
