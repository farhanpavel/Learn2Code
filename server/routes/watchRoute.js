const express = require("express");
const { getVideos } = require("../controllers/codeController");


const watchRoutes = express.Router();
watchRoutes.get("/get-videos", getVideos);

module.exports = watchRoutes;