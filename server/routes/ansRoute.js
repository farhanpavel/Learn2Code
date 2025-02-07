const express = require("express");
const { getAns, postAns } = require("../controllers/ansController");

const ansRoutes = express.Router();

ansRoutes.get("/ans", getAns);

ansRoutes.post("/ans", postAns);
module.exports = ansRoutes;
