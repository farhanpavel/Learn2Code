const express = require("express");
const { resultGet } = require("../controllers/resultController");

const resultRoutes = express.Router();

resultRoutes.post("/result/:id/:title", resultGet);

module.exports = resultRoutes;
