import express from "express";
import { generateImage } from "../controllers/Ai_controller.js";

const router = express.Router();

router.post("/generate", generateImage);

export default router;
