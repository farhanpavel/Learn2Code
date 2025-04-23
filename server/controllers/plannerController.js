require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Planner = require("../models/plannerSchema");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const getGeneratedPlan = async (req, res) => {
  try {
    const { query } = req.body;

    // Validate input
    if (!query) {
      return res
        .status(400)
        .json({ error: "Please enter a valid query to get a plan." });
    }

    const inputPrompt = `Create a  learning roadmap based  ${query}. 
    Return ONLY a JSON array with  titles where take the day from this string '${query}' (one for each day) in this format:
    [
      "title: [Title 1]",
      "title: [Title 2]",
      ...
      "title: [Title..]"
    ]
    Each title should be concise (max 10 words) and describe the main focus for that day but donot mention the day and day number just title:data.
    Respond with JSON only, no explanations or markdown formatting.`;

    const response = await model.generateContent(inputPrompt);

    // Extract response text
    let responseText = response.response.text().trim();

    // Clean response: Remove triple backticks and `json` labels if present
    responseText = responseText.replace(/```json|```/g, "").trim();

    // Attempt to parse the JSON response
    let titlesArray;
    try {
      titlesArray = JSON.parse(responseText);

      // Validate the response is an array with exactly 14 items

      // if (titlesArray.length !== 14) {
      //   throw new Error("Response should contain exactly 14 day titles");
      // }
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return res.status(500).json({
        error: "Failed to parse AI response.",
        details: parseError.message,
      });
    }

    res.status(200).json({ titles: titlesArray });
  } catch (error) {
    console.error("Error generating response from AI:", error);
    res.status(500).json({
      error: "Failed to generate response from AI.",
      details: error.message,
    });
  }
};

// Create a New Planner with Titles
const createPlanner = async (req, res) => {
  try {
    const { title, dayTitles } = req.body; // dayTitles is the array of 14 titles

    // Convert day titles array to steps format
    const steps = dayTitles.map((dayTitle, index) => ({
      step: dayTitle,
      dayNumber: index + 1,
      status: "Not Started",
    }));

    const newPlanner = new Planner({
      title,
      steps,
    });

    await newPlanner.save();
    res.status(201).json({
      message: "Planner created successfully!",
      planner: newPlanner,
    });
  } catch (error) {
    console.error("Error creating planner:", error);
    res.status(500).json({
      error: "Failed to create planner.",
      details: error.message,
    });
  }
};

// Get All Planners
const getAllPlanners = async (req, res) => {
  try {
    const planners = await Planner.find().select(
      "title steps.dayNumber steps.step"
    );
    res.status(200).json(planners);
  } catch (error) {
    console.error("Error fetching planners:", error);
    res.status(500).json({
      error: "Failed to retrieve planners.",
      details: error.message,
    });
  }
};

// Get a Single Planner by ID
const getPlannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const planner = await Planner.findById(id);

    if (!planner) {
      return res.status(404).json({ error: "Planner not found!" });
    }

    res.status(200).json(planner);
  } catch (error) {
    console.error("Error fetching planner:", error);
    res.status(500).json({
      error: "Failed to retrieve planner.",
      details: error.message,
    });
  }
};

// Start a Day (Update Status & Dates)
const startDay = async (req, res) => {
  try {
    const { plannerId, dayNumber } = req.params;

    const planner = await Planner.findOneAndUpdate(
      { _id: plannerId, "steps.dayNumber": parseInt(dayNumber) },
      {
        $set: {
          "steps.$.status": "In Progress",
          "steps.$.startDate": new Date(),
          "steps.$.endDate": new Date(
            new Date().setDate(new Date().getDate() + 1)
          ),
        },
      },
      { new: true }
    );

    if (!planner) {
      return res.status(404).json({ error: "Planner or day not found!" });
    }

    res.status(200).json({
      message: "Day started successfully!",
      planner,
    });
  } catch (error) {
    console.error("Error starting day:", error);
    res.status(500).json({
      error: "Failed to start day.",
      details: error.message,
    });
  }
};

// Mark a Day as Completed
const completeDay = async (req, res) => {
  try {
    const { plannerId, dayNumber } = req.params;

    const planner = await Planner.findOneAndUpdate(
      { _id: plannerId, "steps.dayNumber": parseInt(dayNumber) },
      { $set: { "steps.$.status": "Completed" } },
      { new: true }
    );

    if (!planner) {
      return res.status(404).json({ error: "Planner or day not found!" });
    }

    res.status(200).json({
      message: "Day completed successfully!",
      planner,
    });
  } catch (error) {
    console.error("Error completing day:", error);
    res.status(500).json({
      error: "Failed to complete day.",
      details: error.message,
    });
  }
};

// Delete a Planner
const deletePlanner = async (req, res) => {
  try {
    const { id } = req.params;
    const planner = await Planner.findByIdAndDelete(id);

    if (!planner) {
      return res.status(404).json({ error: "Planner not found!" });
    }

    res.status(200).json({ message: "Planner deleted successfully!" });
  } catch (error) {
    console.error("Error deleting planner:", error);
    res.status(500).json({
      error: "Failed to delete planner.",
      details: error.message,
    });
  }
};

module.exports = {
  getGeneratedPlan,
  createPlanner,
  getAllPlanners,
  getPlannerById,
  startDay,
  completeDay,
  deletePlanner,
};
