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

module.exports = { getPdfAnalysis };
