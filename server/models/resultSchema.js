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
});

module.exports = { resultSchema };
