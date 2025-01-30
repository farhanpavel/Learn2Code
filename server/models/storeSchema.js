const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split("T")[0],
  },
});

module.exports = { storeSchema };
