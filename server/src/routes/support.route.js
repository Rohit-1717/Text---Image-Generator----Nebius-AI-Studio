import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { createSupportReport } from "../controllers/support.report.controller.js";
const router = express.Router();
router.post("/report", requireAuth, createSupportReport);

export default router;
