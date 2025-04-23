const express = require("express");
const botPost = require("../controllers/botController.js");

const botRoutes = express.Router();

botRoutes.post("/bot", botPost);

module.exports = botRoutes;
