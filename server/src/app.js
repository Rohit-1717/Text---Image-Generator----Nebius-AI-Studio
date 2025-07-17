import express from "express";
import cors from "cors";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // frontend URL
    // credentials: true,
  })
);

// Parse incoming JSON requests
app.use(
  express.json({
    limit: "16kb",
  })
);

// Parse URL-encoded data (form submissions)
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(errorHandler);

// Serve static files (e.g., for uploaded files or public assets)
app.use(express.static("public"));

import generateImage from "./routes/generateRoute.js";
app.use("/api", generateImage);

app.get("/", (req, res) => {
  res.send("🧠 ImageAI Server is Running");
});

export { app };
