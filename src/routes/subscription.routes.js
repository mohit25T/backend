import express from "express";
import {
  createOrder,
  verifyPayment,
  getMySubscription,
  getSubscriptionPreview,
} from "../controllers/subscription.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js"; // 🔐 auth middleware

const router = express.Router();

/* =====================================================
   💳 CREATE ORDER (NEW + UPGRADE)
   ===================================================== */
router.post("/create-order", requireAuth, createOrder);

/* =====================================================
   ✅ VERIFY PAYMENT
   ===================================================== */
router.post("/verify-payment", requireAuth, verifyPayment);

/* =====================================================
   📊 GET CURRENT SUBSCRIPTION
   ===================================================== */
router.get("/me", requireAuth, getMySubscription);

/* =====================================================
   🔍 PREVIEW (PRICE CALCULATION)
   ===================================================== */
router.get("/preview", requireAuth, getSubscriptionPreview);

export default router;