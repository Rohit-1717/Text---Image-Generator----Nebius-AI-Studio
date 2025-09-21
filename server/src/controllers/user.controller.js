import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/User.model.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

export const getLoggedInUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, password } = req.body;

  const user = await User.findById(userId).select("+password");
  if (!user) throw new ApiError(404, "User not found");

  if (user.googleId && !user.password) {
    throw new ApiError(
      403,
      "Google accounts cannot update profile via this route"
    );
  }

  // Update name if provided
  if (name) user.name = name;

  // Update avatar if a file is uploaded
  if (req.file) {
    // Convert buffer to base64
    const base64Image = req.file.buffer.toString("base64");
    // Upload to Cloudinary under UserProfile folder
    const avatarUrl = await uploadToCloudinary(base64Image, "UserProfile");
    user.avatar = avatarUrl;
  }

  // Update password if provided
  if (password) {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(password, salt);
    user.passwordChangedAt = new Date();
  }

  await user.save();

  return res.status(200).json({
    status: "success",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    message: "User updated successfully",
  });
});
