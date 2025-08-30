import { doubleCsrf } from "csrf-csrf";

const {
  invalidCsrfTokenError,
  generateToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || "supersecret",
  cookieName: "__Host-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

export const csrfProtection = doubleCsrfProtection;

export const sendCsrfToken = (req, res) => {
  const token = generateToken(req, res);
  res.json({ csrfToken: token });
};

export const csrfErrorHandler = (err, req, res, next) => {
  if (err instanceof invalidCsrfTokenError) {
    return res.status(403).json({
      success: false,
      message: "Invalid or missing CSRF token",
    });
  }
  next(err);
};
