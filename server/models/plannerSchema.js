const mongoose = require("mongoose");

const ReferenceLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["documentation", "video"], required: true },
  embed_url: { type: String } // Optional field for embedded YouTube videos
});

const StepSchema = new mongoose.Schema({
  step: { type: String, required: true },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
  time: { type: Number, required: true }, // Estimated time in days
  reference_links: [ReferenceLinkSchema], // Array of reference links
  status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
  startDate: { type: Date }, // The date the user starts the step
  endDate: { type: Date } // The estimated completion date
});

const PlannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true },
  steps: [StepSchema], // Array of steps
  createdAt: { type: Date, default: Date.now }
});

const Planner = mongoose.model("Planner", PlannerSchema);

module.exports = Planner;
