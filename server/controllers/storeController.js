const mongoose = require("mongoose");
const express = require("express");

const { storeSchema } = require("../models/storeSchema");
const Store = mongoose.model("store", storeSchema);

const storeGet = async (req, res) => {
  try {
    const pdfs = await Store.findOne();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const storePost = async (req, res) => {
  try {
    const { description } = req.body;

    const updatedStore = await Store.findOneAndReplace(
      {},
      { description },
      { upsert: true, new: true }
    );

    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  storeGet,
  storePost,
};
