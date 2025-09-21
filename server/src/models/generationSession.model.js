import mongoose from "mongoose";

const generationSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Generation",
    },
    date: {
      type: String,
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const GenerationSession = mongoose.model(
  "GenerationSession",
  generationSessionSchema
);

export default GenerationSession;
