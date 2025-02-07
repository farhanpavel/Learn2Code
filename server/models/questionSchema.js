const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  theoryquestion: {
    type: String,
    required: true,
  },
});

module.exports = { questionSchema };
