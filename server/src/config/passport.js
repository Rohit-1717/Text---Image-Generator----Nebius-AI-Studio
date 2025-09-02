import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User from "../models/User.model.js";

// Local strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) return done(null, false, { message: "Invalid credentials" });

        const ok = await user.comparePassword(password);
        if (!ok) return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const googleId = profile.id;

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (!user) {
          // ✅ New user
          user = await User.create({
            googleId,
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });

          // 🔑 Temporary flag so we know later
          user.isNew = true;
        } else if (!user.googleId) {
          // Link Google account to existing email signup
          user.googleId = googleId;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;
