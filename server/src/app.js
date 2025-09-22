import express from "express";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { securityMiddlewares } from "./middlewares/security.middleware.js";
import { globalLimiter } from "./middlewares/rateLimiters.js";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";

import generateImage from "./routes/generateRoute.js";
import user from "./routes/user.routes.js";

import image_generator from "./routes/ai.model.routes.js";
import image_download from "./routes/image.format.routes.js";
import sessionRoutes from "./routes/generationSession.routes.js";
import deviceSessionRoutes from "./routes/sessions.routes.js";
import supportRoute from "./routes/support.route.js"
// import paymentRoutes from "./routes/payment.route.js"

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Parse cookies
app.use(cookieParser());


// Trust proxy (needed for secure cookies behind proxies)
if (process.env.TRUST_PROXY)
  app.set("trust proxy", parseInt(process.env.TRUST_PROXY));

// CORS
app.use(
  cors({
    origin: [
      "https://text-image-generator-nebius-v20.vercel.app",
      "http://localhost:5173",
      "https://text-image-generator-nebius-ai-stud.vercel.app",
    ],
    credentials: true,
  })
);

// Logging (avoid logging bodies on auth)
if (process.env.NODE_ENV !== "test") app.use(morgan("tiny"));

app.use(compression());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Security hardening
securityMiddlewares(app);

// Global rate limit
app.use(globalLimiter);

// Passport init (no sessions)
app.use(passport.initialize());

// Static
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => res.send("🧠 Morphix Server is Running"));
app.use("/api/auth", authRoutes);
app.use("/api", generateImage);

// Download Image with formats
app.use("/api", image_download);

// Nebius Image Generator
app.use("/api", image_generator);

// User Routes
app.use("/api/user", user);

// Image Generation Session
app.use("/api/sessions", sessionRoutes);

// Devices Session Management
app.use("/api/devices/sessions", deviceSessionRoutes);

// Payment Routes
// app.use("/api/subscription/payment",paymentRoutes)

// Support Routes
app.use("/api/support", supportRoute);


// Error handler LAST
app.use(errorHandler);

export { app };
