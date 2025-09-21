import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import GeneratedImage from "../models/generatedImage.model.js";
export const generateImage = () => {
  res.redirect(`http://localhost:5173/`);
};

export const getAllGeneratedImages = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  const images = await GeneratedImage.find({ user: userId }).sort({
    createdAt: -1,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, { images }, "Generated images fetched successfully")
    );
});

export const getImageTabs = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch all user images, most recent first
  const images = await GeneratedImage.find({ user: userId }).sort({
    createdAt: -1,
  });

  // Group images by date
  const grouped = {}; // { "YYYY-MM-DD": [images] }
  images.forEach((img) => {
    const date = img.createdAt.toISOString().split("T")[0];
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(img);
  });

  // Determine today's date string
  const today = new Date().toISOString().split("T")[0];

  // Create tabs: split into batches of 40
  const tabs = [];
  Object.entries(grouped).forEach(([date, imgs]) => {
    const numBatches = Math.ceil(imgs.length / 40);
    for (let i = 0; i < numBatches; i++) {
      tabs.push({
        id: `${date}-${i + 1}`,
        label:
          i === 0 ? (date === today ? "Today" : date) : `${date} #${i + 1}`,
        date,
        type: date === today ? "new" : "history",
        imageCount: imgs.length,
      });
    }
  });

  res.status(200).json({ tabs });
});

export const deleteGeneratedImage = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { imageId } = req.params;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  const image = await GeneratedImage.findOne({ _id: imageId, user: userId });
  if (!image) {
    throw new ApiError(404, "Image not found");
  }

  await image.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Image deleted successfully"));
});

export const deleteAllGeneratedImages = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  await GeneratedImage.deleteMany({ user: userId });

  res
    .status(200)
    .json(
      new ApiResponse(200, null, "All generated images deleted successfully")
    );
});

export const getLastGeneratedImage = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  const lastImage = await GeneratedImage.findOne({ user: userId }).sort({
    createdAt: -1,
  });

  if (!lastImage) {
    throw new ApiError(404, "No generated images found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { lastImage }, "Last generated image fetched"));
});
