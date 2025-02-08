require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

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

module.exports = { getGeneratedPlan };
