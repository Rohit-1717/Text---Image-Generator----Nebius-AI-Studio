import OpenAI from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import dotenv from "dotenv";
import GeneratedImage from "../models/generatedImage.model.js";
import GenerationSession from "../models/generationSession.model.js";

dotenv.config();

const client = new OpenAI({
  baseURL: process.env.baseURL,
  apiKey: process.env.NEBIUS_API_KEY,
});

export const nebius_image_model = asyncHandler(async (req, res) => {
  const { prompt, sessionId } = req.body;
  const userId = req.user?._id;

  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(400, "Prompt is required and must be a string");
  }

  try {
    // 1️ Generate image from Nebius
    const response = await client.images.generate({
      model: "black-forest-labs/flux-dev",
      response_format: "url",
      response_extension: "png",
      width: 1024,
      height: 1024,
      num_inference_steps: 28,
      negative_prompt: "",
      seed: -1,
      loras: null,
      prompt,
    });

    const imageUrl = response?.data?.[0]?.url;
    if (!imageUrl) {
      throw new ApiError(500, "Failed to generate image from Nebius");
    }

    // Fetch image & convert to base64
    const imageResp = await fetch(imageUrl);
    const arrayBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // Upload to Cloudinary under Morphix/Nebius
    const cloudinaryUrl = await uploadToCloudinary(base64Image, "Nebius");

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

    //  Save generated image in DB
    const newImage = await GeneratedImage.create({
      user: userId,
      session: session._id, // ✅ link to session
      prompt,
      model: "Nebius",
      imageUrl: cloudinaryUrl,
    });

    //  Update session title if default
    if (session.title === "New Generation") {
      session.title = prompt.slice(0, 30) || "Untitled";
      await session.save();
    }

    //  Return response
    res.status(200).json(
      new ApiResponse(
        200,
        {
          imageUrl: newImage.imageUrl,
          model: newImage.model,
          sessionId: session._id,
        },
        "Nebius image generated and stored successfully"
      )
    );
  } catch (error) {
    console.error("Nebius image generation error:", error);
    throw new ApiError(500, "Nebius image generation failed");
  }
});
