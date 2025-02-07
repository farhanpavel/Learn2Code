const express = require("express");
const { getGeneratedPlan } = require("../controllers/getPlanner");

const aiRoutes = express.Router();
aiRoutes.get("/planner", getGeneratedPlan);

module.exports = aiRoutes;
