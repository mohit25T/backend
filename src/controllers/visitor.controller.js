import VisitorLog from "../models/VisitorLog.js";
import User from "../models/User.js";
import {
  sendPushNotification,
  sendPushNotificationToMany
} from "../services/notificationService.js";
import cloudinary from "../config/cloudinary.js";

/**
 * =====================================================
 * 🔧 Helper: normalize flat number
 * =====================================================
 */
const normalizeFlatNo = (flatNo) =>
  flatNo?.trim().toUpperCase();

/**
 * =====================================================
 * 🔧 Helper: Get valid FCM tokens from user
 * =====================================================
 */
const getUserTokens = (user) => {
  if (!user) return [];
  if (!Array.isArray(user.fcmTokens)) return [];
  return user.fcmTokens.filter(Boolean);
};

/**
 * ===============================
 * 1️⃣ Guard creates visitor entry
 * ===============================
 */
export const createVisitorEntry = async (req, res) => {
  try {
    const {
      personName,
      personMobile,
      purpose,
      vehicleNo,
      wing,
      flatNo,
      entryType,
      deliveryCompany,
      parcelType
    } = req.body;

    const societyId = req.user.societyId;
    const guardId = req.user.userId;

    if (!flatNo) {
      return res.status(400).json({
        message: "Flat number is required"
      });
    }

    const normalizedFlatNo = normalizeFlatNo(flatNo);

    /* =====================================================
       🔍 STEP 1: Find Active Resident (Tenant Priority)
    ===================================================== */

    let targetResidents = await User.find({
      societyId,
      flatNo: normalizedFlatNo,
      roles: { $in: ["TENANT"] },
      status: "ACTIVE"
    });

    if (targetResidents.length === 0) {
      targetResidents = await User.find({
        societyId,
        flatNo: normalizedFlatNo,
        roles: { $in: ["OWNER"] },
        status: "ACTIVE"
      });
    }

    if (targetResidents.length === 0) {
      return res.status(404).json({
        message: "No active resident found for this flat"
      });
    }

    const resident = targetResidents[0];

    /* =====================================================
       🏢 STEP 1.5: Resolve Wing
    ===================================================== */

    let visitorWing = wing;

    // If frontend didn't send wing, use resident's wing
    if (!visitorWing) {
      visitorWing = resident.wing;
    }

    if (!visitorWing) {
      return res.status(400).json({
        message: "Wing is required"
      });
    }

    /* =====================================================
       🚫 STEP 2: Prevent Duplicate Pending Visitors
    ===================================================== */

    const existingPendingVisitor = await VisitorLog.findOne({
      societyId,
      flatNo: normalizedFlatNo,
      personMobile,
      status: "PENDING"
    });

    if (existingPendingVisitor) {
      return res.status(409).json({
        message: "Visitor already has a pending entry for this flat"
      });
    }

    /* =====================================================
       📸 STEP 3: Handle Visitor Photo
    ===================================================== */

    let visitorPhotoUrl = null;

    if (req.files && req.files.length > 0) {
      visitorPhotoUrl = req.files[0].path;
    }

    /* =====================================================
       📝 STEP 4: Create Visitor Entry
    ===================================================== */

    const visitor = await VisitorLog.create({
      societyId,
      residentId: resident._id,
      personName,
      personMobile,
      purpose,
      vehicleNo,
      wing: visitorWing,   // ✅ FIXED
      flatNo: normalizedFlatNo,
      entryType,
      deliveryCompany,
      parcelType,
      guardId,
      visitorPhoto: visitorPhotoUrl,
      status: "PENDING"
    });

    /* =====================================================
       📲 STEP 5: Send Push Notification to Residents
    ===================================================== */

    try {
      const allTokens = targetResidents.flatMap(user =>
        getUserTokens(user)
      );

      if (allTokens.length > 0) {
        await sendPushNotificationToMany(
          allTokens,
          "Visitor Arrived 🚪",
          `${personName} is waiting at the gate for Flat ${visitorWing}-${normalizedFlatNo}`,
          {
            type: "VISITOR_ARRIVED",
            visitorId: visitor._id.toString()
          }
        );
      }
    } catch (pushError) {
      console.error("Push Notification Error:", pushError);
    }

    return res.status(201).json({
      success: true,
      message: "Visitor entry created successfully",
      visitor
    });

  } catch (error) {
    console.error("CREATE VISITOR ERROR:", error);

    return res.status(500).json({
      message: error.message || "Server error"
    });
  }
};


/**
 * =================================
 * 2️⃣ Owner/Tenant approves visitor
 * =================================
 */
export const approveVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const visitor = await VisitorLog.findById(id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found"
      });
    }

    if (visitor.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Visitor already processed"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.flatNo) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const normalizedUserFlat = normalizeFlatNo(user.flatNo);

    if (normalizedUserFlat !== visitor.flatNo) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    visitor.status = "APPROVED";
    visitor.approvedBy = userId;
    visitor.approvedAt = new Date();

    await visitor.save();

    try {
      const guard = await User.findById(visitor.guardId);

      if (guard) {
        const tokens = getUserTokens(guard);

        if (tokens.length > 0) {
          await sendPushNotificationToMany(
            tokens,
            "Visitor Approved ✅",
            `Visitor approved for Flat ${visitor.flatNo}`,
            {
              type: "VISITOR_APPROVED",
              visitorId: visitor._id.toString()
            }
          );
        }
      }
    } catch (pushError) {
      console.error("Push Notification Error:", pushError);
    }

    return res.json({
      success: true,
      message: "Visitor approved successfully",
      visitor
    });

  } catch (error) {
    console.error("APPROVE VISITOR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * =================================
 * 3️⃣ Reject visitor
 * =================================
 */
export const rejectVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await VisitorLog.findById(id);
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    if (visitor.status !== "PENDING") {
      return res.status(400).json({ message: "Visitor already processed" });
    }

    if (visitor.residentId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    visitor.status = "REJECTED";
    visitor.approvedBy = req.user.userId;
    await visitor.save();

    const guard = await User.findById(visitor.guardId);

    if (guard) {
      await sendPushNotificationToMany(
        getUserTokens(guard),
        "Visitor Rejected ❌",
        `Visitor rejected for Flat ${visitor.flatNo}`,
        {
          type: "VISITOR_REJECTED",
          visitorId: visitor._id.toString()
        }
      );
    }

    res.json({ message: "Visitor rejected", visitor });

  } catch (error) {
    console.error("REJECT VISITOR ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * 4️⃣ Guard allows entry
 * ===============================
 */
export const markVisitorEntered = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await VisitorLog.findById(id).populate("residentId");
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    if (visitor.status !== "APPROVED") {
      return res.status(400).json({ message: "Visitor not approved yet" });
    }

    visitor.status = "ENTERED";
    visitor.checkInAt = new Date();
    await visitor.save();

    const guard = await User.findById(visitor.guardId);

    const tokens = [
      ...getUserTokens(visitor.residentId),
      ...getUserTokens(guard)
    ];

    if (tokens.length > 0) {
      await sendPushNotificationToMany(
        tokens,
        "Visitor Entered ✅",
        `${visitor.personName} has entered the society`,
        {
          type: "VISITOR_ENTERED",
          visitorId: visitor._id.toString()
        }
      );
    }

    res.json({ message: "Visitor entered successfully", visitor });

  } catch (error) {
    console.error("ENTER VISITOR ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * 5️⃣ Guard marks exit
 * ===============================
 */
export const markVisitorExited = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await VisitorLog.findById(id).populate("residentId");
    if (!visitor) return res.status(404).json({ message: "Visitor not found" });

    if (visitor.status !== "ENTERED") {
      return res.status(400).json({ message: "Visitor has not entered yet" });
    }

    visitor.status = "EXITED";
    visitor.checkOutAt = new Date();
    await visitor.save();

    const guard = await User.findById(visitor.guardId);

    const tokens = [
      ...getUserTokens(visitor.residentId),
      ...getUserTokens(guard)
    ];

    if (tokens.length > 0) {
      await sendPushNotificationToMany(
        tokens,
        "Visitor Exited 🚶",
        `${visitor.personName} has exited the society`,
        {
          type: "VISITOR_EXITED",
          visitorId: visitor._id.toString()
        }
      );
    }

    res.json({ message: "Visitor exited successfully", visitor });

  } catch (error) {
    console.error("EXIT VISITOR ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ===============================
 * 6️⃣ Get visitors (Pagination)
 * ===============================
 */
export const getVisitors = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { societyId, roles, userId } = req.user;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let filter = { societyId };

    if (roles.includes("TENANT") || roles.includes("OWNER")) {
      filter.flatNo = normalizeFlatNo(user.flatNo);
    }

    if (roles.includes("GUARD")) {
      filter.guardId = userId;
    }

    if (status) {
      filter.status = status.trim().toUpperCase();
    }

    const total = await VisitorLog.countDocuments(filter);

    const visitors = await VisitorLog.find(filter)
      .populate("guardId", "name mobile")
      .populate("approvedBy", "name roles")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();
    console.log("VISITORS FETCHED:", visitors.length, "TOTAL:", total);
    console.log("visitors", visitors);
    res.json({
      success: true,
      data: visitors,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      hasMore: pageNumber * limitNumber < total
    });

  } catch (error) {
    console.error("GET VISITORS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/**
 * ===============================
 * 7️⃣ Get society flats
 * ===============================
 */
export const getSocietyFlats = async (req, res) => {
  try {

    const societyId = req.user.societyId;
    const { wing } = req.query;

    /* =========================
       IF WING NOT PROVIDED
       RETURN AVAILABLE WINGS
    ========================= */

    if (!wing) {

      const wings = await User.distinct("wing", {
        societyId,
        roles: { $in: ["OWNER"] },
        wing: { $ne: null }
      });

      wings.sort();

      return res.json({
        type: "WINGS",
        data: wings.map(w => ({ wing: w }))
      });
    }

    /* =========================
       IF WING PROVIDED
       RETURN FLATS OF THAT WING
    ========================= */

    const owners = await User.find(
      {
        societyId,
        wing,
        roles: { $in: ["OWNER"] },
        flatNo: { $ne: null }
      },
      { flatNo: 1, wing: 1, name: 1 }
    ).sort({ flatNo: 1 });

    return res.json({
      type: "FLATS",
      data: owners.map(o => ({
        wing: o.wing,
        flatNo: o.flatNo,
        ownerName: o.name
      }))
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
};

/**
 * =================================
 * 8️⃣ Resident creates pre-approved guest
 * =================================
 */
export const createPreApprovedGuest = async (req, res) => {
  try {
    const { guestName, guestMobile } = req.body;

    if (!guestName || !guestMobile) {
      return res.status(400).json({
        message: "Guest name and mobile required"
      });
    }

    const resident = await User.findById(req.user.userId);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const visitor = await VisitorLog.create({
      societyId: resident.societyId,
      residentId: resident._id,
      wing: resident.wing,        // ✅ added
      flatNo: resident.flatNo,
      personName: guestName,
      personMobile: guestMobile,
      entryType: "GUEST",
      otp,
      otpStatus: "ACTIVE",
      otpExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      createdByResident: resident._id,
      status: "APPROVED"
    });

    res.status(201).json({
      message: "Guest pre-approved successfully",
      otp,
      visitorId: visitor._id
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * ===============================
 * 9️⃣ Verify guest OTP
 * ===============================
 */
export const verifyGuestOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    const visitor = await VisitorLog.findOne({
      otp,
      otpStatus: "ACTIVE",
      status: "APPROVED"
    }).populate("residentId");

    if (!visitor) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    if (visitor.otpExpiresAt < new Date()) {
      visitor.otpStatus = "EXPIRED";
      await visitor.save();
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    await sendPushNotificationToMany(
      getUserTokens(visitor.residentId),
      "Guest Arrived 🚪",
      `${visitor.personName} has verified OTP at the gate`,
      { type: "OTP_VERIFIED", visitorId: visitor._id.toString() }
    );

    res.json({
      message: "OTP verified",
      visitor: {
        id: visitor._id,
        guestName: visitor.personName,
        wing: visitor.wing,          // ✅ added
        flatNo: visitor.flatNo,
        residentName: visitor.residentId.name
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * ===============================
 * 🔟 Guard allows OTP guest entry
 * ===============================
 */
export const allowOtpGuestEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await VisitorLog.findById(id).populate("residentId");

    if (!visitor) {
      return res.status(404).json({ message: "Guest not found" });
    }

    if (visitor.otpStatus !== "ACTIVE" || visitor.status !== "APPROVED") {
      return res.status(400).json({
        message: "Guest OTP not verified or already entered"
      });
    }

    visitor.status = "ENTERED";
    visitor.otpStatus = "USED";
    visitor.checkInAt = new Date();

    await visitor.save();

    await sendPushNotificationToMany(
      getUserTokens(visitor.residentId),
      "Guest Entered 🚪",
      `${visitor.personName} has entered the society`,
      { type: "OTP_GUEST_ENTERED", visitorId: visitor._id.toString() }
    );

    res.json({
      message: "Guest entered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};