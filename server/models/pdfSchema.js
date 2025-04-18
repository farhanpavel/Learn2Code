const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  pdfUrl: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },

  Booktype: {
    type: String,
    required: true,
  },
  Booktopic: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
  status: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

module.exports = { pdfSchema };
