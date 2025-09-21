import RunwayML from "@runwayml/sdk";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";
import dotenv from "dotenv";
import GeneratedImage from "../models/generatedImage.model.js";
import GenerationSession from "../models/generationSession.model.js";

dotenv.config();

// Initialize RunwayML client
const client = new RunwayML({
  apiKey: process.env.RUNWAY_API_KEY,
});

export const runwayml_image_model = asyncHandler(async (req, res) => {
  const { prompt, sessionId } = req.body;
  const userId = req.user?._id;

  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(400, "Prompt is required and must be a string");
  }

  try {
    //  Generate image using RunwayML
    const task = await client.textToImage
      .create({
        model: "gen4_image",
        promptText: prompt,
        ratio: "1360:768",
      })
      .waitForTaskOutput();

    const imageUrl = task?.output?.[0]?.url;
    if (!imageUrl) {
      throw new ApiError(500, "Failed to generate image from RunwayML");
    }

    //  Fetch the generated image
    const imageResp = await fetch(imageUrl);
    const arrayBuffer = await imageResp.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    //  Upload to Cloudinary under Morphix/RunwayML
    const cloudinaryUrl = await uploadToCloudinary(base64Image, "RunwayML");

    //  Find or create Generation Session
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
      session: session._id,
      prompt,
      model: "RunwayML",
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
        "RunwayML image generated and stored successfully"
      )
    );
  } catch (error) {
    console.error("RunwayML image generation error:", error);
    throw new ApiError(500, "RunwayML image generation failed");
  }
});
