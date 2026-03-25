import express from "express";
import {
  createOrder,
  verifyPayment,
  getMySubscription,
  getSubscriptionPreview,
} from "../controllers/subscriptionController.js";

import { protect } from "../middleware/authMiddleware.js"; // 🔐 auth middleware

const router = express.Router();

/* =====================================================
   💳 CREATE ORDER (NEW + UPGRADE)
   ===================================================== */
router.post("/create-order", protect, createOrder);

/* =====================================================
   ✅ VERIFY PAYMENT
   ===================================================== */
router.post("/verify-payment", protect, verifyPayment);

/* =====================================================
   📊 GET CURRENT SUBSCRIPTION
   ===================================================== */
router.get("/me", protect, getMySubscription);

/* =====================================================
   🔍 PREVIEW (PRICE CALCULATION)
   ===================================================== */
router.get("/preview", protect, getSubscriptionPreview);

export default router;