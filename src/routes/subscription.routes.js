import express from "express";

import {
  createOrder,
  verifyPayment,
  getMySubscription,
  getSubscriptionPreview,
  upgradeSubscription,
} from "../controllers/subscription.controller.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireAdmin } from "../middlewares/role.middleware.js";

const router = express.Router();
router.use(requireAuth); // 🔥 Global auth check for all subscription routes


// 💳 Create Razorpay Order
router.post(
  "/order",
  requireAdmin,
  createOrder
);


// ✅ Verify Payment
router.post(
  "/verify",
  requireAdmin,
  verifyPayment
);


// 📊 Get Active Subscription
router.get(
  "/my",
  getMySubscription
);


// 🔍 Preview (pricing)
router.get(
  "/preview",
  getSubscriptionPreview
);

// ⬆️ Upgrade Subscription 
router.post("/upgrade", upgradeSubscription);

export default router;