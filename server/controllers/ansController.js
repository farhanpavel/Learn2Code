const mongoose = require("mongoose");
const { ansSchema } = require("../models/ansSchema");
const Ans = mongoose.model("Ans", ansSchema);
require("dotenv").config();

const getAns = async (req, res) => {
  const Data = await Ans.find();
  res.status(200).json(Data);
};
const postAns = async (req, res) => {
  const answers = req.body;

  try {
    await Ans.deleteMany({});

    const answersArray = Object.entries(answers).map(([id, answer]) => ({
      id,
      answer,
    }));

    const Data = await Ans.insertMany(answersArray);

    res.status(200).json({ success: true, data: Data });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error saving answers", error });
  }
};

module.exports = { getAns, postAns };
