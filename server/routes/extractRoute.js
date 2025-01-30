const express = require("express");
const multer = require("multer");
const { extractData } = require("../controllers/extractController");

const extractRoutes = express.Router();

extractRoutes.post("/extract-pdf-text", extractData);
module.exports = extractRoutes;
