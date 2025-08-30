import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.model.js";

export const requireAuth = async (req, res, next) => {
  try {
    const cookieName = process.env.JWT_COOKIE_NAME || "aid";
    let token = null;

    // 1) Prefer Authorization header
    const auth = req.headers.authorization;
    if (auth && auth.startsWith("Bearer ")) token = auth.split(" ")[1];

    // 2) Fallback to httpOnly cookie
    if (!token) token = req.cookies?.[cookieName];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Optional: invalidate if password changed after token
    if (user.passwordChangedAt && decoded.iat * 1000 < user.passwordChangedAt.getTime()) {
      return res.status(401).json({ message: "Please login again" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};
