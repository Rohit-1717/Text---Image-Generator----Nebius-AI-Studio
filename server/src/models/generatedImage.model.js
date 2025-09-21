import mongoose from "mongoose";

const generatedImageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // relation with User schema
      required: true,
    },
    session: { type: mongoose.Schema.Types.ObjectId, ref: "GenerationSession" },
    prompt: { type: String, required: true, trim: true },
    model: { type: String, required: true },
    imageUrl: { type: String, required: true },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const GeneratedImage = mongoose.model("GeneratedImage", generatedImageSchema);

export default GeneratedImage;
