import express from "express";
import { nebius_image_model } from "../ai_models/nebius_ai_model.js";
import { gemini_image_model } from "../ai_models/gemini_ai_model.js";
import { midJourney_image_model } from "../ai_models/midJourney_ai_model.js";
import { runwayml_image_model } from "../ai_models/runway_ai_model.js";
import { x_ai_image_model } from "../ai_models/x-ai_ai_model.js";
import { openai_image } from "../ai_models/openai_model.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  deleteAllGeneratedImages,
  deleteGeneratedImage,
  getAllGeneratedImages,
  getLastGeneratedImage,
} from "../controllers/Ai_controller.js";
const router = express.Router();

router.post("/generate/nebius-image", requireAuth, nebius_image_model);
router.post("/generate/gemini-image", requireAuth, gemini_image_model);
router.post("/generate/midjourney-image", requireAuth, midJourney_image_model);
router.post("/generate/runway-image", requireAuth, runwayml_image_model);
router.post("/generate/x-ai-image", requireAuth, x_ai_image_model);
router.post("/generate/openai-image", requireAuth, openai_image);
// router.post("/generate/3d-nvidia-image", nebius_image_model);

// Get Generated Images
router.get("/generate/images-generated", requireAuth, getAllGeneratedImages);
router.delete("/delete/:imageId", requireAuth, deleteGeneratedImage);
router.delete("/delete-all", requireAuth, deleteAllGeneratedImages);


// History:
router.get("/get-last-image", requireAuth, getLastGeneratedImage);

export default router;
