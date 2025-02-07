const express = require("express");
const { getGeneratedPlan } = require("../controllers/getPlanner");

const aiRoutes = express.Router();
aiRoutes.post("/planner", getGeneratedPlan);

module.exports = aiRoutes;
