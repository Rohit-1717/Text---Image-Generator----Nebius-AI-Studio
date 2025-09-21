import express from "express";
import { getLoggedInUser, updateUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

router.get("/user-details", requireAuth, getLoggedInUser);
router.put("/update-user", requireAuth, upload.single("avatar"),updateUser);

export default router;
