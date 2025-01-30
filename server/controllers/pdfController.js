const mongoose = require("mongoose");

const express = require("express");
const multer = require("multer");
const cloudinary = require("../cloudinary");
const { pdfSchema } = require("../models/pdfSchema");
const Pdf = mongoose.model("pdf", pdfSchema);
const router = express.Router();

const pdfGet = async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const pdfGetByid = async (req, res) => {
  try {
    const pdfs = await Pdf.findOne({ _id: req.params.id });
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const pdfPost = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const result = await new Promise((resolve, reject) => {
      try {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" }, // Auto-detect file type
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      } catch (error) {
        reject(error);
      }
    });

    const newPdf = new Pdf({
      pdfUrl: result.secure_url,
      name: req.file.originalname,
      Booktype: req.body.Booktype,
      Booktopic: req.body.Booktopic,
    });

    await newPdf.save();
    res.status(201).json({ message: "File uploaded", data: newPdf });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  pdfGet,
  pdfPost,
  pdfGetByid,
};
