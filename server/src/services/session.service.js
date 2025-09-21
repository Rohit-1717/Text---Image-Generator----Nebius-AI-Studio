import Session from "../models/Session.model.js";
import mongoose from "mongoose";
import UAParser from "ua-parser-js";
import geoip from "geoip-lite";


export const createSession = async ({
  req,
  user,
  token,
  sessionId = null,
  ttlMs = 7 * 24 * 60 * 60 * 1000,
}) => {
  sessionId = sessionId || new mongoose.Types.ObjectId().toString();

  const uaString = req.headers["user-agent"] || "";
  const parser = new UAParser(uaString);
  const deviceInfo = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  const ip =
    req.ip ||
    (req.headers["x-forwarded-for"] || "").split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "";
  const geo = geoip.lookup(ip) || {};
  const location = geo.city ? `${geo.city}, ${geo.country}` : geo.country || "";

  const session = await Session.create({
    userId: user._id,
    sessionId,
    token,
    userAgent: uaString,
    device:
      deviceInfo.model || deviceInfo.vendor || deviceInfo.type || "Unknown",
    browser: `${browser.name || ""} ${browser.version || ""}`.trim(),
    os: os.name || "",
    ip,
    location,
    expiresAt: new Date(Date.now() + ttlMs),
  });

  return session;
};

export const findSessionsByUser = async (userId) =>
  Session.find({ userId }).sort({ createdAt: -1 });
export const findSessionBySessionId = async (sessionId) =>
  Session.findOne({ sessionId });
export const deleteSessionBySessionId = async (sessionId) =>
  Session.deleteOne({ sessionId });
export const deleteAllSessionsForUser = async (userId) =>
  Session.deleteMany({ userId });
export const deleteSessionById = async (id) => Session.deleteOne({ _id: id });
