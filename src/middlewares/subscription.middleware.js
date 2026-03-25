import Subscription from "../models/Subscription.js";
import Flat from "../models/Flats.js";

export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const societyId = req.user?.societyId;
    const flatId = req.user?.flatId;

    if (!societyId) {
      return res.status(400).json({
        message: "Society not found in user",
        code: "INVALID_SOCIETY",
      });
    }

    // ===============================
    // 🔥 FETCH SUBSCRIPTION
    // ===============================
    const subscription = await Subscription.findOne({
      societyId,
      status: "active",
    })
      .select("endDate status plan allowedFlats")
      .lean();

    // ❌ No subscription
    if (!subscription) {
      return res.status(403).json({
        message: "Subscription required",
        code: "SUBSCRIPTION_REQUIRED",
        upgradeRequired: true, // 🔥 IMPORTANT
      });
    }

    const now = new Date();

    // ❌ Expired
    if (now > subscription.endDate) {
      await Subscription.updateOne(
        { societyId, status: "active" },
        { status: "expired" }
      );

      return res.status(403).json({
        message: "Subscription expired",
        code: "SUBSCRIPTION_EXPIRED",
        upgradeRequired: true, // 🔥 IMPORTANT
      });
    }

    // ===============================
    // 🔥 FLAT LIMIT LOGIC (FINAL)
    // ===============================
    if (flatId) {
      const flat = await Flat.findById(flatId)
        .select("isWithinLimit")
        .lean();

      if (!flat) {
        return res.status(404).json({
          message: "Flat not found",
          code: "FLAT_NOT_FOUND",
        });
      }

      // ❌ Not within limit → FORCE UPGRADE
      if (!flat.isWithinLimit) {
        return res.status(403).json({
          message:
            "Your flat is not included in current subscription. Please upgrade.",
          code: "FLAT_LIMIT_EXCEEDED",
          upgradeRequired: true,
        });
      }
    }

    // ===============================
    // ✅ ALLOW REQUEST
    // ===============================
    req.subscription = {
      plan: subscription.plan,
      endDate: subscription.endDate,
      allowedFlats: subscription.allowedFlats,
    };

    next();

  } catch (error) {
    console.error("Subscription Check Error:", error);

    res.status(500).json({
      message: "Server Error",
      code: "SERVER_ERROR",
    });
  }
};