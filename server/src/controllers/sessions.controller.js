import Session from "../models/Session.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const listSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ userId: req.user._id })
    .select("-token -__v")
    .sort({ createdAt: -1 });
  res.json({ sessions });
});




export const deleteSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await Session.findOne({ sessionId });
  if (!session) throw new ApiError(404, "Session not found");

  await Session.deleteOne({ sessionId });

  // If the client is deleting their own current session, clear cookie
  if (req.session && req.session.sessionId === sessionId) {
    res.clearCookie(process.env.JWT_COOKIE_NAME || "aid");
  }

  res.json({ message: "Logged out from device" });
});

export const logoutAll = asyncHandler(async (req, res) => {
  await Session.deleteMany({ userId: req.user._id });
  res.clearCookie(process.env.JWT_COOKIE_NAME || "aid");
  res.json({ message: "Logged out from all devices" });
});
