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

    // 🔥 Count flats
    const totalFlats = await Flat.countDocuments({ societyId });
      console.log(totalFlats);
    if (totalFlats === 0) {
      return res.status(400).json({
        message: "No flats found for this society",
      });
    }

    // 🔥 Prevent duplicate active subscription
    const existing = await Subscription.findOne({
      societyId,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({
        message: "Active subscription already exists",
      });
    }

    // 💰 Pricing
    let pricePerFlat = 20;

    if (plan === "yearly") {
      pricePerFlat = 200;
    }

    const totalAmount = totalFlats * pricePerFlat;

    // 💳 Razorpay order
    const options = {
      amount: totalAmount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      order,
      totalFlats,
      totalAmount,
      plan,
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ===============================
// ✅ VERIFY PAYMENT + CREATE SUBSCRIPTION
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

    // 🔥 Count flats again (secure)
    const totalFlats = await Flat.countDocuments({ societyId });

    let pricePerFlat = 20;
    let durationDays = 30;

    if (plan === "yearly") {
      pricePerFlat = 200;
      durationDays = 365;
    }

    const totalAmount = totalFlats * pricePerFlat;

    // 📅 Dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + durationDays);

    // 🔥 Expire old subscriptions
    await Subscription.updateMany(
      { societyId, status: "active" },
      { status: "expired" }
    );

    // ✅ Create new subscription
    const subscription = await Subscription.create({
      societyId,
      plan,
      pricePerFlat,
      totalFlats,
      totalAmount,
      startDate,
      endDate,
    });

    res.status(200).json({
      message: "Payment successful & subscription activated",
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
    console.log(subscription);

    res.status(200).json({ subscription });

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

    const totalFlats = await Flat.countDocuments({ societyId });

    let pricePerFlat = 20;

    if (plan === "yearly") {
      pricePerFlat = 200;
    }

    const totalAmount = totalFlats * pricePerFlat;

    res.status(200).json({
      totalFlats,
      pricePerFlat,
      totalAmount,
      plan,
    });

  } catch (error) {
    console.error("Preview Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
