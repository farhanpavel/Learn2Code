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
  const user_id = req.user.id;
  let answersArray = req.body; // Use let to allow modifications

  try {
    // Ensure answersArray is an array
    if (!Array.isArray(answersArray)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data format" });
    }

    const updatedAnswers = answersArray.map((answer) => ({
      ...answer,
      user_id,
    }));

    const Data = await Ans.insertMany(updatedAnswers);

    res.status(200).json({ success: true, data: Data });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error saving answers", error });
  }
};

module.exports = { getAns, postAns };
