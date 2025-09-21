import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiters.js";
import { downloadImage } from "../controllers/format.controller.js";

const router = Router();

router.get("/generated-image/download", requireAuth, authLimiter, downloadImage);

export default router;
