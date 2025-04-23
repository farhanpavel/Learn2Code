const express = require("express");
const {
  getPdfAnalysis,
  streamLearningResources,
} = require("../controllers/aiController");
const { getCodeReview } = require("../controllers/codeController");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const aiRoutes = express.Router();
aiRoutes.post("/analyze-pdf", upload.single("image"), getPdfAnalysis);
aiRoutes.post("/code-review", getCodeReview);
aiRoutes.get("/resources/stream", streamLearningResources);

module.exports = aiRoutes;
