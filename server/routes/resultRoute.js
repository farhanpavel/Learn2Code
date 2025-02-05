const express = require("express");
const { resultGet } = require("../controllers/resultController");

const resultRoutes = express.Router();

resultRoutes.get("/result", resultGet);

module.exports = resultRoutes;
