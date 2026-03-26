import Subscription from "../models/Subscription.js";
import Flat from "../models/Flats.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";

// ===============================
// 💳 CREATE RAZORPAY ORDER
// ===============================
export const createOrder = async (req, res) => {
  try {
    const societyId = req.user.societyId;
    const { plan = "monthly" } = req.body;

    const existing = await Subscription.findOne({
      societyId,
      status: "active",
    });

    const totalFlatsInDB = await Flat.countDocuments({ societyId });

    let totalFlats;
    let isUpgrade = false;

    if (existing) {
      isUpgrade = true;

      const extraFlats = Math.max(
        totalFlatsInDB - existing.allowedFlats,
        0
      );

      totalFlats =
        extraFlats > 0
          ? extraFlats
          : existing.allowedFlats;
    } else {
      totalFlats = totalFlatsInDB;

      if (totalFlats === 0) {
        return res.status(400).json({
          message: "No flats found for this society",
        });
      }
    }

    const pricePerFlat = plan === "yearly" ? 200 : 20;
    const totalAmount = totalFlats * pricePerFlat;

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      order,
      totalFlats,
      totalAmount,
      plan,
      isUpgrade,
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// ✅ VERIFY PAYMENT + CREATE/UPGRADE
// ===============================
export const verifyPayment = async (req, res) => {
  try {
    const societyId = req.user.societyId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = "monthly",
    } = req.body;

    // 🔐 Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const pricePerFlat = plan === "yearly" ? 200 : 20;
    const durationDays = plan === "yearly" ? 365 : 30;

    const existing = await Subscription.findOne({
      societyId,
      status: "active",
    });

    const totalFlatsInDB = await Flat.countDocuments({ societyId });

    let subscription;

    // ===============================
    // 🔄 UPGRADE
    // ===============================
    if (existing) {
      const extraFlats = Math.max(
        totalFlatsInDB - existing.allowedFlats,
        0
      );

      const newAllowedFlats =
        existing.allowedFlats + extraFlats;

      existing.allowedFlats = newAllowedFlats;
      existing.totalFlats = totalFlatsInDB;

      existing.plan = plan;
      existing.pricePerFlat = pricePerFlat;

      const now = new Date();
      existing.endDate = new Date(
        now.setDate(now.getDate() + durationDays)
      );

      existing.totalAmount =
        newAllowedFlats * pricePerFlat;

      await existing.save();

      subscription = existing;
    }

    // ===============================
    // 🆕 NEW SUBSCRIPTION
    // ===============================
    else {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + durationDays);

      await Subscription.updateMany(
        { societyId, status: "active" },
        { status: "expired" }
      );

      subscription = await Subscription.create({
        societyId,
        plan,
        pricePerFlat,
        totalFlats: totalFlatsInDB,
        allowedFlats: totalFlatsInDB,
        totalAmount: totalFlatsInDB * pricePerFlat,
        startDate,
        endDate,
      });
    }

    // ===============================
    // 🔥 APPLY FLAT LIMITS
    // ===============================
    const flats = await Flat.find({ societyId })
      .sort({ flatIndex: 1 });

    const allowedIds = flats
      .slice(0, subscription.allowedFlats)
      .map(f => f._id);

    // ✅ Enable allowed flats
    await Flat.updateMany(
      { _id: { $in: allowedIds } },
      { isSubscribed: true, isWithinLimit: true }
    );

    // ❌ Disable remaining flats
    await Flat.updateMany(
      { _id: { $nin: allowedIds }, societyId },
      { isSubscribed: false, isWithinLimit: false }
    );

    res.status(200).json({
      message: "Subscription updated successfully",
      subscription,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// 📊 GET CURRENT SUBSCRIPTION
// ===============================
export const getMySubscription = async (req, res) => {
  try {
    const societyId = req.user.societyId;

    const subscription = await Subscription.findOne({
      societyId,
      status: "active",
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({
        message: "No active subscription found",
      });
    }

    res.status(200).json({
      status: subscription.status,
      plan: subscription.plan,
      amount: subscription.totalAmount,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      allowedFlats: subscription.allowedFlats,
      totalFlats: subscription.totalFlats,
    });

  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===============================
// 🔍 PREVIEW SUBSCRIPTION
// ===============================
export const getSubscriptionPreview = async (req, res) => {
  try {
    const societyId = req.user.societyId;
    const { plan = "monthly" } = req.query;

    const existing = await Subscription.findOne({
      societyId,
      status: "active",
    });

    const totalFlatsInDB = await Flat.countDocuments({ societyId });

    const allowedFlats = existing?.allowedFlats || 0;

    const extraFlats = Math.max(
      totalFlatsInDB - allowedFlats,
      0
    );

    let totalFlats;
    let isUpgrade = false;

    if (existing) {
      isUpgrade = true;

      totalFlats =
        extraFlats > 0
          ? extraFlats
          : allowedFlats;
    } else {
      totalFlats = totalFlatsInDB;

      if (totalFlats === 0) {
        return res.status(400).json({
          message: "No flats found for this society",
        });
      }
    }

    const pricePerFlat = plan === "yearly" ? 200 : 20;
    const totalAmount = totalFlats * pricePerFlat;

    res.status(200).json({
      totalFlats,
      pricePerFlat,
      totalAmount,
      plan,
      isUpgrade,
      totalFlatsInDB,
      allowedFlats,
      extraFlats,
    });

  } catch (error) {
    console.error("Preview Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};