const mongoose = require("mongoose");

const express = require("express");
const jobansSchema = new mongoose.Schema({
  mark: {
    type: String,
    required: true,
  },
  suggestion: {
    type: String,
    default: "", // Initially, the answer will be blank
  },
});

module.exports = { jobansSchema };
