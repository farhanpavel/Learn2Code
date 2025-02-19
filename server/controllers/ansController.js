const mongoose = require("mongoose");
const { ansSchema } = require("../models/ansSchema");
const Ans = mongoose.model("Ans", ansSchema);
require("dotenv").config();

const getAns = async (req, res) => {
  const Data = await Ans.find({
    id: req.params.id,
    title: req.params.title,
  });
  res.status(200).json(Data);
};
const postAns = async (req, res) => {
  const answersArray = req.body;

  try {
    // // Ensure the answers are formatted as an array with the desired fields
    // const answersArray = Object.keys(answers).map((id) => ({
    //   id, // The question ID
    //   answer: answers[id] || "I do not know", // Default to "I do not know" if no answer is provided
    //   user_id, // The user ID
    //   title, // The title
    // }));

    // Insert the formatted answers into the database
    const Data = await Ans.insertMany(answersArray);

    // Respond with the saved data
    res.status(200).json({ success: true, data: Data });
  } catch (error) {
    // Handle errors and send a proper response
    res
      .status(500)
      .json({ success: false, message: "Error saving answers", error });
  }
};

module.exports = { getAns, postAns };
