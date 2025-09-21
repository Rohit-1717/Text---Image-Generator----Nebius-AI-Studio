import { Router } from "express";
import {
  register,
  loginLocal,
  logout,
  me,
  authGoogle,
  authGoogleCallback,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rateLimiters.js";

const router = Router();

// Register
router.post("/register", validate(registerSchema), register);

// Login (passport-local + limiter)
router.post("/login", authLimiter, validate(loginSchema), loginLocal);

// Google OAuth
router.get("/google", authLimiter, authGoogle);
router.get("/google/callback", authGoogleCallback);

// Current user
router.get("/me", requireAuth, (req, res) => me(req, res));

// Send verification email (resend)
router.post("/email/send-verification", requireAuth, sendVerificationEmail);

// Verify email with token
router.get("/email/verify/:token", verifyEmail);

// Logout
router.post("/logout", requireAuth, logout);

export default router;
