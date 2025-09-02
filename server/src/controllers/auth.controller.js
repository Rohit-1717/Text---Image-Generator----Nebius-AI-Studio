import passport from "../config/passport.js";
import User from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";

const cookieName = process.env.JWT_COOKIE_NAME || "aid";
const inProd = process.env.NODE_ENV === "production";

const setAuthCookie = (res, token) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: inProd, // true in prod (HTTPS)
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password });

  const token = signToken({ id: user._id, email: user.email });
  setAuthCookie(res, token);

  res
    .status(201)
    .json({ user: { id: user._id, name: user.name, email: user.email } });
};

export const loginLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: info?.message || "Unauthorized" });

    const token = signToken({ id: user._id, email: user.email });
    setAuthCookie(res, token);
    return res.json({
      user: { id: user._id, name: user.name, email: user.email },
    });
  })(req, res, next);
};

export const logout = async (req, res) => {
  res.clearCookie(cookieName);
  res.json({ message: "Logged out" });
};

export const me = async (req, res) => {
  const u = req.user;
  res.json({
    user: { id: u._id, name: u.name, email: u.email, avatar: u.avatar },
  });
};

// Google entry (passport handles redirect)
export const authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

// Google callback → set cookie + redirect back to frontend
export const authGoogleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${process.env.FRONTEND_URL}/auth/fail`);

    const token = signToken({ id: user._id, email: user.email });
    setAuthCookie(res, token);

    // Avoid putting token in URL. Cookie is now set on API domain.
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  })(req, res, next);
};
