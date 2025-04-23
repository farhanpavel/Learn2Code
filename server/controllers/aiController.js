require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../cloudinary");

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  top_k: 40,
  max_output_tokens: 8192,
  response_mime_type: "text/plain",
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  generationConfig,
});

const uploadToCloudinary = (buffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

const getPdfAnalysis = async (req, res) => {
  try {
    const { fullPdfText = "", selectedText = "", context = "" } = req.body;
    const hasImage = !!req.file;
    let imagePrompt = "";

    console.log("===== Incoming Request Debug Info =====");
    console.log("Has Image:", hasImage);
    console.log("Full PDF Text Length:", fullPdfText.length);
    console.log("Selected Text Length:", selectedText.length);
    console.log("Context:", context);

    if (hasImage) {
      console.log("Uploading image to Cloudinary...");

      const result = await uploadToCloudinary(req.file.buffer);
      console.log("Uploaded image URL:", result.secure_url);

      const base64Image = req.file.buffer.toString("base64");

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: req.file.mimetype,
        },
      };

      console.log("Calling Gemini model with image...");
      const aiResponse = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "Extract text from this image as accurately as possible. Include all symbols, numbers, and formatting.",
              },
              imagePart,
            ],
          },
        ],
      });

      const extractedText = aiResponse?.response?.text?.();
      console.log("Extracted Text from Image:", extractedText);

      imagePrompt = `Here is the extracted text from the image: ${extractedText}\n`;
    }

    if (!fullPdfText && !selectedText && !hasImage) {
      console.log("No valid input provided. Returning 400.");
      return res.status(400).json({
        error: "Either PDF text, selected text, or image is required.",
      });
    }

    const inputPrompt = `Analyze the following content and explain it clearly in 3-4 sentences:
    
${fullPdfText ? `PDF Context: ${fullPdfText}\n` : ""}
${selectedText ? `Selected Text: ${selectedText}\n` : ""}
${context ? `User Context: ${context}\n` : ""}
${imagePrompt}

Please provide:
1. A simple explanation
2. Key points to remember
3. Any important context
`;

    console.log("Final Input Prompt:\n", inputPrompt);

    const response = await model.generateContent(inputPrompt);
    const analysis = response?.response?.text?.();
    console.log("Final AI Response:", analysis);

    res.status(200).json({
      result: analysis,
      type: hasImage ? (selectedText ? "text+image" : "image") : "text",
    });
  } catch (error) {
    console.error("❌ Error generating response from AI:", error);
    res.status(500).json({
      error: "Failed to generate analysis",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
// data

const getYoutubeVideos = async (title) => {
  try {
    const url = `https://youtube138.p.rapidapi.com/search/?q=${encodeURIComponent(
      title
    )}%20tutorial&hl=en&gl=US`;

    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.RAPID_API_KEY,
        "x-rapidapi-host": "youtube138.p.rapidapi.com",
      },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    const result = await response.json();
    const firstVideo = result.contents?.find((item) => item.type === "video");

    if (!firstVideo?.video?.videoId) {
      return null;
    }

    return `https://www.youtube.com/watch?v=${firstVideo.video.videoId}`;
  } catch (error) {
    console.error("Error fetching YouTube video:", error);
    return null;
  }
};

// Controller to stream resources
const streamLearningResources = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Helper to send SSE events with valid JSON
    const sendEvent = (type, data) => {
      if (!data || (data.chunk && !data.chunk.trim())) {
        console.log(`Skipping empty ${type} event`);
        return; // Skip empty or invalid data
      }
      const jsonData = JSON.stringify(data);
      console.log(`Sending ${type} event:`, jsonData);
      res.write(`event: ${type}\n`);
      res.write(`data: ${jsonData}\n\n`);
    };

    // Send YouTube URL first
    const youtubeUrl = await getYoutubeVideos(title);
    sendEvent("youtube", { url: youtubeUrl || "" });

    // Gemini prompt for description, code, and documentation
    const comprehensivePrompt = `Provide detailed learning resources about "${title}" in this exact format:

# DESCRIPTION
[Provide a comprehensive 3-4 paragraph explanation covering:
1. Key concepts and fundamentals
2. Practical applications
3. Important considerations or limitations]

# CODE EXAMPLES
[Provide exactly 3 practical code examples in this format:
\`\`\`language (e.g., python, javascript)
// Example 1: [Brief title]
[Actual code snippet]
\`\`\`
[1-2 sentence explanation of what this demonstrates]

\`\`\`language
// Example 2: [Brief title]
[Actual code snippet]
\`\`\`
[Explanation]

\`\`\`language
// Example 3: [Brief title]
[Actual code snippet]
\`\`\`
[Explanation]]

# DOCUMENTATION
[Provide 3-5 official documentation links in this format:
- [Title](URL): [Brief description]
- [Title](URL): [Brief description]]

IMPORTANT:
- Use triple backticks (\`\`\`) for code blocks, specifying the language
- Ensure clear section headings (# DESCRIPTION, # CODE EXAMPLES, # DOCUMENTATION)
- Code examples must be valid, practical, and relevant to "${title}"
- Documentation links must be from official sources (e.g., pandas.pydata.org for Pandas)
- Do not skip any section`;

    // Stream Gemini response
    let buffer = "";
    let currentSection = null;

    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: comprehensivePrompt }] }],
    });

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (!chunkText?.trim()) {
        console.log("Skipping empty Gemini chunk");
        continue; // Skip empty chunks
      }

      console.log("Raw Gemini chunk:", chunkText); // Debug raw chunk
      buffer += chunkText;

      // Process section markers
      const sectionMarkers = {
        "# DESCRIPTION": "description",
        "# CODE EXAMPLES": "code",
        "# DOCUMENTATION": "docs",
      };

      for (const [marker, section] of Object.entries(sectionMarkers)) {
        if (buffer.includes(marker) && currentSection !== section) {
          // Send remaining content from previous section
          if (currentSection) {
            const content = buffer.split(marker)[0].trim();
            if (content) {
              sendEvent(currentSection, { chunk: content });
            }
          }
          buffer = buffer.split(marker)[1] || "";
          currentSection = section;
        }
      }

      // Send current section content if enough data is buffered
      if (currentSection && buffer.trim()) {
        const lines = buffer.split("\n");
        const lastLine = lines[lines.length - 1];
        // Only send if the last line is complete or a paragraph
        if (lastLine === "" || lines.length > 1 || buffer.includes("\n\n")) {
          const content = buffer.trim();
          if (content) {
            sendEvent(currentSection, { chunk: content });
            buffer = ""; // Clear buffer after sending
          }
        }
      }
    }

    // Flush remaining buffer
    if (currentSection && buffer.trim()) {
      sendEvent(currentSection, { chunk: buffer.trim() });
    }

    // Send completion event
    sendEvent("complete", { status: "done" });

    res.end();
  } catch (error) {
    console.error("Error streaming resources:", error);
    sendEvent("error", { error: error.message });
    res.end();
  }
};
module.exports = { getPdfAnalysis, streamLearningResources };
