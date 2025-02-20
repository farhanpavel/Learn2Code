const express = require("express");
const { resultGet, extractData } = require("../controllers/resultController");
const { jwtAuthentication } = require("../middlewares/authMiddleware");

const resultRoutes = express.Router();

resultRoutes.post("/result/:title", jwtAuthentication, resultGet);
resultRoutes.post("/result/all/data", extractData);

module.exports = resultRoutes;
