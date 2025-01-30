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
});

module.exports = { pdfSchema };
