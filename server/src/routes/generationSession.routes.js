import express from "express";
import {
  createSession,
  getUserSessions,
  renameSession,
  deleteSession,
  getSessionById,
} from "../controllers/generationSession.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes need authentication
router.post("/create", requireAuth, createSession);
router.get("/get-user-session", requireAuth, getUserSessions);
router.get("/:sessionId", requireAuth, getSessionById);

router.put("/:sessionId", requireAuth, renameSession);
router.delete("/:sessionId", requireAuth, deleteSession);

export default router;
