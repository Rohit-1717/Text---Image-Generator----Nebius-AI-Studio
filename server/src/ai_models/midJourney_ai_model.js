import { GoogleGenAI } from "@google/genai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import GeneratedImage from "../models/generatedImage.model.js";
import GenerationSession from "../models/generationSession.model.js";

// Initialize Gemini client (used as MidJourney proxy here)
const ai = new GoogleGenAI({
  project: "morphix-470613",
  location: "us-central1",
});

// MidJourney image generation + Cloudinary upload
export const midJourney_image_model = asyncHandler(async (req, res) => {
  const { prompt, sessionId } = req.body;
  const userId = req.user?._id;
  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(400, "Prompt is required and must be a string");
  }

  try {
    // Generate image from Gemini (proxy for MidJourney)
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001", // fallback model
      prompt,
      config: { numberOfImages: 1 },
    });

    if (!response.generatedImages?.length) {
      throw new ApiError(500, "Failed to generate image from MidJourney");
    }

    const imgBytes = response.generatedImages[0].image.imageBytes;
    const base64Image = Buffer.from(imgBytes, "base64").toString("base64");

    // upload to Cloudinary (Morphix/MidJourney folder)
    const imageUrl = await uploadToCloudinary(base64Image, "MidJourney");

    // Find or create Generation Session
    let session;
    if (sessionId) {
      session = await GenerationSession.findById(sessionId);
    }
    if (!session) {
      session = await GenerationSession.create({
        user: userId,
        date: new Date().toISOString().split("T")[0],
      });
    }

    // Save generated image in DB
    const newImage = await GeneratedImage.create({
      user: userId,
      session: session._id,
      prompt,
      model: "MidJourney",
      imageUrl,
    });

    // Update session title if default
    if (session.title === "New Generation") {
      session.title = prompt.slice(0, 30) || "Untitled";
      await session.save();
    }

    // Return response
    res.status(200).json(
      new ApiResponse(
        200,
        {
          imageUrl: newImage.imageUrl,
          model: newImage.model,
          sessionId: session._id,
        },
        "MidJourney image generated and stored successfully"
      )
    );
  } catch (error) {
    console.error("MidJourney image generation error:", error);
    throw new ApiError(500, "MidJourney image generation failed");
  }
});
