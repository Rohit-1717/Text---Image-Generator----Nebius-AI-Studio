// lib/multer.js
import multer from "multer";

// Use memory storage so files are kept in memory as buffer
const storage = multer.memoryStorage();

// Export multer instance
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max size
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export { upload };
