import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionId: { type: String, required: true, index: true, unique: true },
  token: { type: String, required: true },
  userAgent: { type: String },
  device: { type: String },
  browser: { type: String },
  os: { type: String },
  ip: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }, 
});

sessionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Session", sessionSchema);
