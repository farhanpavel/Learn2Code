const express = require("express");
const multer = require("multer");
const { pdfGet, pdfPost, pdfGetByid } = require("../controllers/pdfController");

const pdfRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
pdfRoutes.get("/pdfs", pdfGet);
pdfRoutes.get("/pdfs/:id", pdfGetByid);
pdfRoutes.post("/upload", upload.single("pdfFile"), pdfPost);

module.exports = pdfRoutes;
