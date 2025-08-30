import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300, // 300 requests / 15 min per IP
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please try later." },
});

export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20, // 20 login attempts / 10 min
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, try again later." },
});
