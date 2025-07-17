import OpenAI from "openai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import dotenv from "dotenv";

dotenv.config({
  path: "",
});

const client = new OpenAI({
  baseURL: process.env.baseURL,
  apiKey: process.env.NEBIUS_API_KEY,
});

export const generateImage = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(400, "Prompt is required and must be a string");
  }

  const response = await client.images.generate({
    model: "black-forest-labs/flux-dev",
    response_format: "url", // 👈 returning direct URL
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

  res
    .status(200)
    .json(new ApiResponse(200, { imageUrl }, "Image generated successfully"));
});
