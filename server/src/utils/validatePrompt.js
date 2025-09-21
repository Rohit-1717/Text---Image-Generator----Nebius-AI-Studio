// utils/validatePrompt.js
import { ApiError } from "./apiError.js";

// 🚫 Disallowed words list (expand as needed)
const blockedWords = ["nude", "nsfw", "sex", "porn", "vulgar"];

export function validatePrompt(prompt) {
  if (!prompt || typeof prompt !== "string") {
    throw new ApiError(400, "Prompt is required and must be a string");
  }

  const lowerPrompt = prompt.toLowerCase();
  if (blockedWords.some((w) => lowerPrompt.includes(w))) {
    throw new ApiError(
      400,
      "Your prompt violates content policy. Please try again with a different prompt."
    );
  }

  return true;
}
