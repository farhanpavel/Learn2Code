const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  ans: {
    type: String,
    required: true,
  },
  correctness: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = { resultSchema };
