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
      });
    }

    // ===============================
    // 🔥 FLAT LIMIT LOGIC (MAIN FIX)
    // ===============================
    if (flatId) {
      // 🔥 Get all flats in order (IMPORTANT)
      const flats = await Flat.find({ societyId })
        .sort({ createdAt: 1 }) // oldest first
        .select("_id")
        .lean();

      // Take only allowed flats
      const allowedFlatIds = flats
        .slice(0, subscription.allowedFlats)
        .map(f => f._id.toString());

      const isAllowed = allowedFlatIds.includes(flatId.toString());

      if (!isAllowed) {
        return res.status(403).json({
          message: "Your flat is not included in current subscription. Please upgrade.",
          code: "FLAT_LIMIT_EXCEEDED",
          upgradeRequired: true,
          allowedFlats: subscription.allowedFlats,
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