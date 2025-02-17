const mongoose = require("mongoose");

const express = require("express");
const jobQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: "", // Initially, the answer will be blank
  },
});

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  questions: [jobQuestionSchema], // Array of questions
});

const Job = mongoose.model("Job", jobSchema);

module.exports = { jobSchema, jobQuestionSchema };
