import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { trace } from "potrace";

// Allowed raster formats Cloudinary supports
const RASTER_FORMATS = ["png", "jpeg", "jpg", "webp", "gif"];

export const downloadImage = asyncHandler(async (req, res) => {
  const { url, format } = req.query;

  if (!url || !format) {
    throw new ApiError(400, "url and format are required");
  }

  const lowerFormat = format.toLowerCase();

  // ✅ Case 1: SVG conversion (vectorize)
  if (lowerFormat === "svg") {
    try {
      // Fetch PNG/JPG/WEBP/GIF from Cloudinary
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data);

      // Convert raster → SVG using potrace
      trace(buffer, (err, svg) => {
        if (err) {
          console.error("SVG conversion failed:", err);
          return res
            .status(500)
            .json({ message: "Failed to convert image to SVG" });
        }

        res.setHeader("Content-Type", "image/svg+xml");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="image.svg"`
        );
        res.send(svg);
      });
      return;
    } catch (error) {
      console.error("Error fetching image for SVG:", error.message);
      throw new ApiError(500, "SVG conversion failed");
    }
  }

  // ✅ Case 2: Raster formats (direct Cloudinary conversion)
  if (!RASTER_FORMATS.includes(lowerFormat)) {
    throw new ApiError(
      400,
      `Invalid format. Allowed: ${[...RASTER_FORMATS, "svg"].join(", ")}`
    );
  }

  // Build new Cloudinary URL with requested format
  const newUrl = url.replace(/\.(png|jpg|jpeg|webp|gif)$/i, `.${lowerFormat}`);

  // Fetch file from Cloudinary
  const response = await axios.get(newUrl, { responseType: "arraybuffer" });

  // Set headers for download
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="image.${lowerFormat}"`
  );
  res.setHeader("Content-Type", response.headers["content-type"]);

  // Send file data back
  res.send(response.data);
});
