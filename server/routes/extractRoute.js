const express = require("express");
const multer = require("multer");
const {
  extractData,
  questionData,
  questionGet,
} = require("../controllers/extractController");

const extractRoutes = express.Router();

extractRoutes.post("/extract-pdf-text", extractData);

extractRoutes.post("/data/question-generate", questionData);
extractRoutes.get("/data/question-generate/:id/:title", questionGet);
module.exports = extractRoutes;
