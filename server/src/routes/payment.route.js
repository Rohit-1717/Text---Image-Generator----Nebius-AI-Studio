import express from "express";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { initiatePayment } from "../controllers/payment.controller.js";

const router = express.Router();

// Initiate a payment (authenticated)
router.post("/initiate", requireAuth, initiatePayment);

// PhonePe callback (server-to-server)
router.post("/callback/:transactionId", paymentCallback);

export default router;
