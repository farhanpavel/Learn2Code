const express = require("express");
const { getPdfAnalysis } = require("../controllers/aiController");

const aiRoutes = express.Router();
aiRoutes.post("/analyze-pdf", getPdfAnalysis);

module.exports = aiRoutes;
