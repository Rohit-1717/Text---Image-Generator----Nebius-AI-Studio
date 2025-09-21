import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Session from "../models/Session.model.js";


export const requireAuth = async (req, res, next) => {
  try {
    const cookieName = process.env.JWT_COOKIE_NAME || "aid";
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id || !decoded?.sessionId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // First find the session without date filter
    const session = await Session.findOne({
      sessionId: decoded.sessionId,
      userId: decoded.id
    });

    // Then check expiration manually
    if (!session || !session.expiresAt || session.expiresAt <= new Date()) {
      return res.status(401).json({ message: "Unauthorized: Invalid session" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    if (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({ message: "Unauthorized: Please login again" });
    }

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// export const requireAuth = async (req, res, next) => {
//   try {
//     const cookieName = process.env.JWT_COOKIE_NAME || "aid";
//     let token;

//     //  Prefer Authorization header
//     if (req.headers.authorization?.startsWith("Bearer ")) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     //  Fallback to httpOnly cookie
//     if (!token) token = req.cookies?.[cookieName];

//     // No token found
//     if (!token) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: No token provided" });
//     }

//     //  Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded?.id || !decoded?.sessionId) {
//       return res.status(401).json({ message: "Unauthorized: Invalid token" });
//     }

//     //  Check session in DB - FIX: Create new Date object properly
//     const currentDate = new Date();
//     const session = await Session.findOne({
//       sessionId: decoded.sessionId,
//       userId: decoded.id,
//       expiresAt: { $gt: currentDate }, // ✅ Fixed: Pass Date object directly
//     });

//     if (!session) {
//       return res.status(401).json({ message: "Unauthorized: Invalid session" });
//     }

//     //  Find user in DB
//     const user = await User.findById(decoded.id).select("-password");
//     if (!user) {
//       return res.status(401).json({ message: "Unauthorized: User not found" });
//     }

//     //  Optional: invalidate token if password changed after token issuance
//     if (
//       user.passwordChangedAt &&
//       decoded.iat * 1000 < user.passwordChangedAt.getTime()
//     ) {
//       return res
//         .status(401)
//         .json({ message: "Unauthorized: Please login again" });
//     }

//     //  Attach user + session to request
//     req.user = user;
//     req.session = session;

//     //  All good
//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };
