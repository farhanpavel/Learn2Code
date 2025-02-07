const mongoose = require("mongoose");

const ansSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

module.exports = { ansSchema };
