require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Planner = require("../models/plannerSchema");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const getGeneratedPlan = async (req, res) => {
  try {
    const { query, level } = req.body;

    // Validate input
    if (!query || !level) {
      return res
        .status(400)
        .json({ error: "Please enter a valid query and level to get a plan." });
    }

    // Adjusted prompt to include embedded YouTube videos
    const inputPrompt = `Give me a roadmap for ${query} at the ${level} level. 
    Return a JSON object with:
    - title: The title of the entire roadmap.
    - description: A brief description of the roadmap.
    - steps: An array of objects containing:
      - step: A specific learning step.
      - time: The estimated time to complete the step in days (for absolute beginners).
      - difficulty: The difficulty level (Beginner, Intermediate, Advanced).
      - reference_links: An array of objects containing:
        - title: The title of the reference.
        - url: The URL of the reference.
        - type: Either "documentation" or "video".
        - embed_url: If it's a video, return the embeddable YouTube URL in the format "https://www.youtube.com/embed/VIDEO_ID".
    Respond with JSON only, no explanations or markdown formatting.`;

    const response = await model.generateContent(inputPrompt);

    // Extract response text
    let responseText = response.response.text().trim();

    // Clean response: Remove triple backticks and `json` labels if present
    responseText = responseText.replace(/```json|```/g, "").trim();

    // Attempt to parse the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);

      // Ensure the response structure is correct
      if (!jsonResponse.steps || !Array.isArray(jsonResponse.steps)) {
        throw new Error("Invalid JSON structure: 'steps' array is missing.");
      }

      // Convert YouTube links to embeddable format
      jsonResponse.steps.forEach((step) => {
        if (step.reference_links && Array.isArray(step.reference_links)) {
          step.reference_links.forEach((link) => {
            if (link.type === "video" && link.url.includes("youtube.com/watch?v=")) {
              const videoId = link.url.split("v=")[1].split("&")[0]; // Extract YouTube video ID
              link.embed_url = `https://www.youtube.com/embed/${videoId}`;
            }
          });
        }
      });
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({ error: "Failed to parse AI response." });
    }

    res.status(200).json({ result: jsonResponse });
  } catch (error) {
    console.error("Error generating response from AI:", error);
    res.status(500).json({ error: "Failed to generate response from AI." });
  }
};

// 📌 Create a New Planner
const createPlanner = async (req, res) => {
  try {
    const { title, description, level, steps } = req.body;

    const newPlanner = new Planner({
      title,
      description,
      level,
      steps
    });

    await newPlanner.save();
    res.status(201).json({ message: "Planner created successfully!", planner: newPlanner });
  } catch (error) {
    console.error("Error creating planner:", error);
    res.status(500).json({ error: "Failed to create planner." });
  }
};

// 📌 Get All Planners
const getAllPlanners = async (req, res) => {
  try {
    const planners = await Planner.find();
    res.status(200).json(planners);
  } catch (error) {
    console.error("Error fetching planners:", error);
    res.status(500).json({ error: "Failed to retrieve planners." });
  }
};

// 📌 Get a Single Planner by ID
const getPlannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const planner = await Planner.findById(id);

    if (!planner) return res.status(404).json({ error: "Planner not found!" });

    res.status(200).json(planner);
  } catch (error) {
    console.error("Error fetching planner:", error);
    res.status(500).json({ error: "Failed to retrieve planner." });
  }
};

// 📌 Start a Step (Update Status & Dates)
const startStep = async (req, res) => {
  try {
    const { plannerId, stepId } = req.params;

    const planner = await Planner.findOneAndUpdate(
      { _id: plannerId, "steps._id": stepId },
      {
        $set: {
          "steps.$.status": "In Progress",
          "steps.$.startDate": new Date(),
          "steps.$.endDate": new Date(new Date().setDate(new Date().getDate() + 7)) // Default 7 days
        }
      },
      { new: true }
    );

    if (!planner) return res.status(404).json({ error: "Planner or step not found!" });

    res.status(200).json({ message: "Step started successfully!", planner });
  } catch (error) {
    console.error("Error starting step:", error);
    res.status(500).json({ error: "Failed to start step." });
  }
};

// 📌 Mark a Step as Completed
const completeStep = async (req, res) => {
  try {
    const { plannerId, stepId } = req.params;

    const planner = await Planner.findOneAndUpdate(
      { _id: plannerId, "steps._id": stepId },
      { $set: { "steps.$.status": "Completed" } },
      { new: true }
    );

    if (!planner) return res.status(404).json({ error: "Planner or step not found!" });

    res.status(200).json({ message: "Step completed successfully!", planner });
  } catch (error) {
    console.error("Error completing step:", error);
    res.status(500).json({ error: "Failed to complete step." });
  }
};

// 📌 Delete a Planner
const deletePlanner = async (req, res) => {
  try {
    const { id } = req.params;

    const planner = await Planner.findByIdAndDelete(id);

    if (!planner) return res.status(404).json({ error: "Planner not found!" });

    res.status(200).json({ message: "Planner deleted successfully!" });
  } catch (error) {
    console.error("Error deleting planner:", error);
    res.status(500).json({ error: "Failed to delete planner." });
  }
};

module.exports = { getGeneratedPlan, createPlanner,
  getAllPlanners,
  getPlannerById,
  startStep,
  completeStep,
  deletePlanner };