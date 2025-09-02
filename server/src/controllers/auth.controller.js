import passport from "../config/passport.js";
import transporter from "../lib/nodemailer.js";
import User from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";

const cookieName = process.env.JWT_COOKIE_NAME || "aid";
const inProd = process.env.NODE_ENV === "production";

const setAuthCookie = (res, token) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: "none", // allow frontend <> backend on diff domains
    secure: inProd, // true in production
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({ name, email, password });
  welcomeMail({ name, email });

  const token = signToken({ id: user._id, email: user.email });
  setAuthCookie(res, token);

  res.json({
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const loginLocal = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: info?.message || "Unauthorized" });

    const token = signToken({ id: user._id, email: user.email });
    setAuthCookie(res, token);
    res.json({
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

export const authGoogleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: "OAuth failed" });

    // ✅ Send welcome mail if new user
    if (user.isNew) {
      welcomeMail({ name: user.name, email: user.email }).catch((err) =>
        console.error("Failed to send welcome email:", err)
      );
    }

    const token = signToken({ id: user._id, email: user.email });
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
