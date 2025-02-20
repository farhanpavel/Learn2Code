const express = require("express");
const { getAns, postAns } = require("../controllers/ansController");
const { jwtAuthentication } = require("../middlewares/authMiddleware");

const ansRoutes = express.Router();

ansRoutes.get("/ans", getAns);

ansRoutes.post("/ans", jwtAuthentication, postAns);
module.exports = ansRoutes;
