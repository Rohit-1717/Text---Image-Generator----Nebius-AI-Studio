import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, select: false },
    googleId: { type: String, index: true, sparse: true },
    emailVerified: { type: Boolean, default: false },
    plan: { type: String, enum: ["Free", "Pro", "Premium"], default: "Free" },
    subscriptionEnd: { type: Date },
    lastLogin: { type: Date },
    avatar: { type: String },
    passwordChangedAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
  },
  { timestamps: true }
);

// Hash password if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
