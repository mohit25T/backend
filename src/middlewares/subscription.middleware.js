import Subscription from "../models/Subscription.js";
import Flat from "../models/Flats.js"; // 🔥 ADDED

export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const societyId = req.user?.societyId;
    const flatId = req.user?.flatId; // 🔥 ADDED

    if (!societyId) {
      return res.status(400).json({
        message: "Society not found in user",
        code: "INVALID_SOCIETY",
      });
    }

    // 🔥 Fetch subscription
    const subscription = await Subscription.findOne({
      societyId,
      status: "active",
    })
      .select("endDate status plan allowedFlats") // 🔥 ADDED allowedFlats
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

    /* =====================================================
       🔥 NEW: FLAT LEVEL ACCESS CHECK
    ===================================================== */

    if (flatId) {
      const flat = await Flat.findById(flatId)
        .select("isSubscribed")
        .lean();

      // ❌ Flat not allowed in plan
      if (!flat || !flat.isSubscribed) {
        return res.status(403).json({
          message: "Your flat is not included in subscription. Please upgrade.",
          code: "FLAT_NOT_SUBSCRIBED", // 🔥 important for frontend
        });
      }
    }

    /* =====================================================
       ✅ ALLOW REQUEST
    ===================================================== */

    req.subscription = {
      plan: subscription.plan,
      endDate: subscription.endDate,
      allowedFlats: subscription.allowedFlats, // 🔥 ADDED
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