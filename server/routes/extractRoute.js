const express = require("express");
const multer = require("multer");
const {
  extractData,
  questionData,
  questionGet,
} = require("../controllers/extractController");
const { jwtAuthentication } = require("../middlewares/authMiddleware");

const extractRoutes = express.Router();

extractRoutes.post("/extract-pdf-text", extractData);

extractRoutes.post("/data/question-generate", jwtAuthentication, questionData);
extractRoutes.get(
  "/data/question-generate/:title",
  jwtAuthentication,
  questionGet
);
module.exports = extractRoutes;
