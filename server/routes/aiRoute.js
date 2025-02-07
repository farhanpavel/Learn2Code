const express = require("express");
const { getPdfAnalysis } = require("../controllers/aiController");
const { getCodeReview } = require("../controllers/codeController");

const aiRoutes = express.Router();
aiRoutes.post("/analyze-pdf", getPdfAnalysis);
aiRoutes.post("/code-review",getCodeReview)

module.exports = aiRoutes;
