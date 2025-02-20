const express = require("express");
const multer = require("multer");
const {
  pdfGet,
  pdfPost,
  pdfGetByid,
  pdfDelete,
} = require("../controllers/pdfController");
const { jwtAuthentication } = require("../middlewares/authMiddleware");

const pdfRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
pdfRoutes.get("/pdfs", jwtAuthentication, pdfGet);
pdfRoutes.delete("/pdfs/:id", pdfDelete);
pdfRoutes.get("/pdfs/:id", pdfGetByid);
pdfRoutes.post("/upload", jwtAuthentication, upload.single("pdfFile"), pdfPost);

module.exports = pdfRoutes;
