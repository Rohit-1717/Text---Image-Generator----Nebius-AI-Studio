import GenerationSession from "../models/generationSession.model.js";
import GeneratedImage from "../models/generatedImage.model.js";

// Create a new session
export const createSession = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    const newSession = await GenerationSession.create({
      user: userId,
      date: today,
      deleted: false, // 👈 always set default
    });

    res.status(201).json({ success: true, data: newSession });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch all sessions for a user (exclude deleted)
export const getUserSessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await GenerationSession.find({
      user: userId,
      deleted: false, // 👈 only fetch active
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch a single session by ID (exclude deleted)
export const getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await GenerationSession.findOne({
      _id: sessionId,
      user: userId,
      deleted: false, // 👈 don’t allow deleted
    }).lean();

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const images = await GeneratedImage.find({
      session: sessionId,
    })
      .sort({ createdAt: 1 }) // oldest first
      .lean();

    res.json({ success: true, data: { ...session, images } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Rename session
export const renameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    const updated = await GenerationSession.findOneAndUpdate(
      { _id: sessionId, user: req.user._id, deleted: false }, // 👈 block renaming deleted
      { title },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found or deleted" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Soft delete session
export const deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    const session = await GenerationSession.findOneAndUpdate(
      { _id: sessionId, user: userId, deleted: false }, // 👈 prevent double delete
      { deleted: true },
      { new: true }
    );

    if (!session) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Session not found or already deleted",
        });
    }

    res.json({ success: true, message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
