const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  theoryquestion: {
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

module.exports = { questionSchema };
