const express = require("express");
const { getGeneratedPlan, createPlanner, getAllPlanners, getPlannerById, startStep, completeStep, deletePlanner } = require("../controllers/plannerController");

const aiRoutes = express.Router();
aiRoutes.post("/planner", getGeneratedPlan);
aiRoutes.post("/planner/create", createPlanner);
aiRoutes.get("/planner", getAllPlanners);
aiRoutes.get("/planner/:id", getPlannerById);
aiRoutes.put("/planner/:plannerId/step/:stepId/start", startStep);
aiRoutes.put("/planner/:plannerId/step/:stepId/complete", completeStep);
aiRoutes.delete("/planner/:id", deletePlanner);


module.exports = aiRoutes;
