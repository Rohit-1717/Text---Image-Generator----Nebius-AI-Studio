import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Log on startup
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  console.log("🌩️ Cloudinary is configured and ready to upload files.");
} else {
  console.error("❌ Cloudinary configuration missing! Check your .env file.");
}

// Universal uploader
export async function uploadToCloudinary(base64Image, modelName) {
  try {
    const folderName = modelName.replace(/\s+/g, "").replace(/\./g, "");

    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${base64Image}`,
      {
        folder: `Morphix/${folderName}`,
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        public_id: `${folderName}-${Date.now()}`, // custom identifier
      }
    );

    return result.secure_url;
  } catch (err) {
    console.error("❌ Cloudinary upload error:", err.message);
    throw new Error("Failed to upload image to Cloudinary");
  }
}

export default cloudinary;
