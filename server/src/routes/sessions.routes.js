import express from "express";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { deleteSession, listSessions, logoutAll } from "../controllers/sessions.controller.js";

const router = express.Router();

// all sessions routes require the user to be authenticated
router.get("/", requireAuth, listSessions);
router.delete("/:sessionId", requireAuth, deleteSession); // logout that session
router.post("/logout-all", requireAuth, logoutAll);

export default router;
