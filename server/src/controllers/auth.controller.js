import passport from "../config/passport.js";
import transporter from "../lib/nodemailer.js";
import User from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import crypto from "crypto";
import useragent from "useragent";
import Session from "../models/Session.model.js";
import { v4 as uuidv4 } from "uuid";

const cookieName = process.env.JWT_COOKIE_NAME || "aid";
const inProd = process.env.NODE_ENV === "production";

const setAuthCookie = (res, token) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: inProd,
    sameSite: inProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper to create a session + JWT

const createSessionAndToken = async (req, user) => {
  const agent = useragent.parse(req.headers["user-agent"]);

  // generate sessionId + token
  const sessionId = uuidv4();
  const rawToken = crypto.randomBytes(32).toString("hex");

  const session = await Session.create({
    userId: user._id,
    sessionId,
    token: rawToken,
    userAgent: req.headers["user-agent"] || "",
    device: agent.device.toString(),
    browser: agent.toAgent(),
    ip: req.ip,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // create JWT that embeds user + sessionId
  const jwtToken = signToken({
    id: user._id,
    email: user.email,
    sessionId: session.sessionId,
  });

  return { token: jwtToken, session };
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password });
  welcomeMail({ name, email });

  const { token } = await createSessionAndToken(req, user);

  setAuthCookie(res, token);

  res.json({
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const loginLocal = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res
          .status(401)
          .json({ message: info?.message || "Unauthorized" });

      const { token } = await createSessionAndToken(req, user);

      setAuthCookie(res, token);

      res.json({
        user: { id: user._id, name: user.name, email: user.email },
      });
    }
  )(req, res, next);
};

export const logout = async (req, res) => {
  if (req.session?._id) {
    await Session.deleteOne({ _id: req.session._id }); // ✅ delete current session
  }
  res.clearCookie(cookieName);
  res.json({ message: "Logged out" });
};

// 🚀 Logout from all devices
export const logoutAll = async (req, res) => {
  await Session.deleteMany({ userId: req.user._id });
  res.clearCookie(cookieName);
  res.json({ message: "Logged out from all devices" });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

// Google entry (passport handles redirect)
export const authGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

export const authGoogleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "OAuth failed" });

    if (user.isNew) {
      welcomeMail({ name: user.name, email: user.email }).catch((err) =>
        console.error("Failed to send welcome email:", err)
      );
    }

    const { token } = await createSessionAndToken(req, user);

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(process.env.FRONTEND_URL + "/dashboard");
  })(req, res, next);
};
export const welcomeMail = async ({ name, email }) => {
  try {
    const mailOptions = {
      from: '"Morphix AI" <no-reply@morphixai.com>',
      to: email,
      subject: `Welcome to Morphix AI, ${name}!`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background: #4F46E5; padding: 20px; text-align: center; color: #fff;">
          <img src="https://text-image-generator-nebius-v20.vercel.app/logo.webp" alt="Morphix AI Logo" width="100" style="margin-bottom: 10px;" />
          <h1>Welcome to Morphix AI!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi <strong>${name}</strong>,</p>
          <p>We’re excited to have you on board! Morphix AI is your one-stop platform to unleash creativity using AI. Here’s what you can explore:</p>
          <ul>
            <li>🎨 <strong>Text to Image</strong></li>
            <li>🖼️ <strong>Image to Image</strong></li>
            <li>🧊 <strong>Image to 3D Model</strong></li>
            <li>🔤 <strong>Text to 3D Model</strong></li>
            <li>🌐 <strong>Multi-modal Platform</strong> — One Platform, Endless Creations</li>
          </ul>
          <p>Explore a wide range of AI models from <strong>OpenAI, Google Gemini, xAI</strong>, and more. Generate stunning images effortlessly — all in one place!</p>
          <p style="text-align: center; margin-top: 30px;">
            <a href="https://text-image-generator-nebius-v20.vercel.app" style="background: #4F46E5; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold;">Get Started</a>
          </p>
          <p style="margin-top: 30px;">— The Morphix AI Team</p>
        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.emailVerified) {
    return res.status(400).json({ message: "Email already verified" });
  }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h expiry
  await user.save();

  // Send verification email
  await transporter.sendMail({
    from: '"Morphix AI" <no-reply@morphixai.com>',
    to: user.email,
    subject: `Verify Your Email, ${user.name}!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <!-- Header -->
        <div style="background: #4F46E5; padding: 20px; text-align: center; color: #fff;">
          <img src="https://text-image-generator-nebius-v20.vercel.app/logo.webp" alt="Morphix AI Logo" width="100" style="margin-bottom: 10px;" />
          <h1>Verify Your Email</h1>
        </div>

        <!-- Body -->
        <div style="padding: 20px;">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Thanks for joining Morphix AI! Before you start exploring, please verify your email by clicking the button below:</p>

          <!-- Verification button -->
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.BACKEND_URL}/api/auth/email/verify/${token}" target="_blank" style="background: #4F46E5; color: #fff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email
            </a>
          </p>

          <p style="margin-top: 30px;">If you didn’t create an account, you can safely ignore this email.</p>

          <p style="margin-top: 30px;">— The Morphix AI Team</p>
        </div>
      </div>
    `,
  });

  res.status(200).json({ message: "Verification email sent" });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  // Aggregation ensures comparison works correctly
  const [user] = await User.aggregate([
    { $match: { verificationToken: token } },
    {
      $addFields: {
        expiryValid: { $gt: ["$verificationTokenExpiry", new Date()] },
      },
    },
    { $match: { expiryValid: true } },
    { $limit: 1 },
  ]);

  if (!user) throw new ApiError(400, "Invalid or expired token");

  // Update user using _id
  await User.updateOne(
    { _id: user._id },
    {
      $set: { emailVerified: true },
      $unset: { verificationToken: "", verificationTokenExpiry: "" },
    }
  );

  return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
});
