import Subscription from "../models/Subscription.js";

export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const societyId = req.user?.societyId;

    if (!societyId) {
      return res.status(400).json({
        message: "Society not found in user",
        code: "INVALID_SOCIETY",
      });
    }

    // 🔥 Fetch only required fields (optimized)
    const subscription = await Subscription.findOne({
      societyId,
      status: "active",
    })
      .select("endDate status plan")
      .lean();

    // ❌ No active subscription
    if (!subscription) {
      return res.status(403).json({
        message: "Subscription required",
        code: "SUBSCRIPTION_REQUIRED", // 🔥 important for frontend
      });
    }

    const now = new Date();

    // ❌ Expired subscription
    if (now > subscription.endDate) {
      // 🔥 Update status (do not block response)
      await Subscription.updateOne(
        { societyId, status: "active" },
        { status: "expired" }
      );

      return res.status(403).json({
        message: "Subscription expired",
        code: "SUBSCRIPTION_EXPIRED", // 🔥 frontend handling
      });
    }

    // ✅ Attach minimal data (safe + fast)
    req.subscription = {
      plan: subscription.plan,
      endDate: subscription.endDate,
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