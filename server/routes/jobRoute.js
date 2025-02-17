const express = require("express");
const multer = require("multer");
const {
  postResumeAndExtractSummary,
  getResumeAndExtractSummary,
  updateAnswer,
  storeEvaluationData,
  getStorejob,
} = require("../controllers/jobController");

const jobRoutes = express.Router();

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });

// Add the upload middleware to handle file uploads
jobRoutes.post(
  "/data-extract",
  upload.single("file"),
  postResumeAndExtractSummary
);
jobRoutes.get("/data-extract", getResumeAndExtractSummary);
jobRoutes.get("/data/answer", getStorejob);
jobRoutes.put("/data-extract/:id", updateAnswer);
jobRoutes.post("/store-evaluation", storeEvaluationData);
module.exports = jobRoutes;
