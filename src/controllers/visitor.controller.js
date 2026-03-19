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

    /* =====================================================
       ✅ BASIC VALIDATION
    ===================================================== */

    if (!flatNo) {
      return res.status(400).json({
        message: "Flat number is required"
      });
    }

    if (!personName) {
      return res.status(400).json({
        message: "Visitor name is required"
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

    if (!targetResidents.length) {
      targetResidents = await User.find({
        societyId,
        flatNo: normalizedFlatNo,
        roles: { $in: ["OWNER"] },
        status: "ACTIVE"
      });
    }

    if (!targetResidents.length) {
      return res.status(404).json({
        message: "No active resident found for this flat"
      });
    }

    const resident = targetResidents[0];

    /* =====================================================
       🏢 STEP 1.5: Resolve Wing
    ===================================================== */

    let visitorWing = wing || resident.wing;

    if (!visitorWing) {
      return res.status(400).json({
        message: "Wing is required"
      });
    }

    visitorWing = visitorWing.toUpperCase();

    /* =====================================================
       🔒 SECURITY: Ensure resident belongs to same wing
    ===================================================== */

    if (resident.wing !== visitorWing) {
      return res.status(400).json({
        message: "Invalid wing for selected flat"
      });
    }

    /* =====================================================
       🚫 STEP 2: Prevent Duplicate Pending Visitors
    ===================================================== */

    const existingPendingVisitor = await VisitorLog.findOne({
      societyId,
      flatNo: normalizedFlatNo,
      wing: visitorWing,
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
      personName: personName.trim(),
      personMobile,
      purpose,
      vehicleNo,
      wing: visitorWing,
      flatNo: normalizedFlatNo,
      entryType,
      deliveryCompany,
      parcelType,
      guardId,
      visitorPhoto: visitorPhotoUrl,
      status: "PENDING"
    });

    /* =====================================================
       📲 STEP 5: Send Push Notification
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

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

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
    const { userId, societyId } = req.user;

    /* =====================================================
       🔍 STEP 1: Find Visitor
    ===================================================== */

    const visitor = await VisitorLog.findById(id);

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found"
      });
    }

    /* =====================================================
       🔒 SECURITY: SAME SOCIETY CHECK
    ===================================================== */

    if (visitor.societyId.toString() !== societyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    /* =====================================================
       🚫 STATUS CHECK
    ===================================================== */

    if (visitor.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Visitor already processed"
      });
    }

    /* =====================================================
       🔍 STEP 2: Find User
    ===================================================== */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* =====================================================
       🔒 SECURITY: ROLE CHECK
    ===================================================== */

    if (
      !user.roles.includes("OWNER") &&
      !user.roles.includes("TENANT")
    ) {
      return res.status(403).json({
        success: false,
        message: "Only resident can approve visitor"
      });
    }

    /* =====================================================
       🔒 SECURITY: FLAT + WING MATCH
    ===================================================== */

    const normalizedUserFlat = normalizeFlatNo(user.flatNo);

    if (
      normalizedUserFlat !== visitor.flatNo ||
      user.wing !== visitor.wing
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized for this flat"
      });
    }

    /* =====================================================
       ✅ APPROVE VISITOR
    ===================================================== */

    visitor.status = "APPROVED";
    visitor.approvedBy = userId;
    visitor.approvedAt = new Date();

    await visitor.save();

    /* =====================================================
       📲 NOTIFY GUARD
    ===================================================== */

    try {
      const guard = await User.findById(visitor.guardId);

      if (guard) {
        const tokens = getUserTokens(guard);

        if (tokens.length > 0) {
          await sendPushNotificationToMany(
            tokens,
            "Visitor Approved ✅",
            `Visitor approved for Flat ${visitor.wing}-${visitor.flatNo}`,
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

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

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
    const { userId, societyId } = req.user;

    /* =====================================================
       🔍 STEP 1: Find Visitor
    ===================================================== */

    const visitor = await VisitorLog.findById(id);

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    /* =====================================================
       🔒 SECURITY: SAME SOCIETY CHECK
    ===================================================== */

    if (visitor.societyId.toString() !== societyId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    /* =====================================================
       🚫 STATUS CHECK
    ===================================================== */

    if (visitor.status !== "PENDING") {
      return res.status(400).json({
        message: "Visitor already processed"
      });
    }

    /* =====================================================
       🔍 STEP 2: Find User
    ===================================================== */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    /* =====================================================
       🔒 ROLE CHECK
    ===================================================== */

    if (
      !user.roles.includes("OWNER") &&
      !user.roles.includes("TENANT")
    ) {
      return res.status(403).json({
        message: "Only resident can reject visitor"
      });
    }

    /* =====================================================
       🔒 FLAT + WING VALIDATION
    ===================================================== */

    const normalizedUserFlat = normalizeFlatNo(user.flatNo);

    if (
      normalizedUserFlat !== visitor.flatNo ||
      user.wing !== visitor.wing
    ) {
      return res.status(403).json({
        message: "Unauthorized for this flat"
      });
    }

    /* =====================================================
       ❌ REJECT VISITOR
    ===================================================== */

    visitor.status = "REJECTED";
    visitor.approvedBy = userId;
    visitor.approvedAt = new Date();

    await visitor.save();

    /* =====================================================
       📲 NOTIFY GUARD
    ===================================================== */

    try {
      const guard = await User.findById(visitor.guardId);

      if (guard) {
        const tokens = getUserTokens(guard);

        if (tokens.length > 0) {
          await sendPushNotificationToMany(
            tokens,
            "Visitor Rejected ❌",
            `Visitor rejected for Flat ${visitor.wing}-${visitor.flatNo}`,
            {
              type: "VISITOR_REJECTED",
              visitorId: visitor._id.toString()
            }
          );
        }
      }
    } catch (pushError) {
      console.error("Push Notification Error:", pushError);
    }

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    res.json({
      success: true,
      message: "Visitor rejected successfully",
      visitor
    });

  } catch (error) {
    console.error("REJECT VISITOR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
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
    const { userId, societyId, roles } = req.user;

    /* =====================================================
       🔍 STEP 1: Find Visitor
    ===================================================== */

    const visitor = await VisitorLog.findById(id).populate("residentId");

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    /* =====================================================
       🔒 SECURITY: SAME SOCIETY CHECK
    ===================================================== */

    if (visitor.societyId.toString() !== societyId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    /* =====================================================
       🔒 ROLE CHECK (ONLY GUARD)
    ===================================================== */

    if (!roles.includes("GUARD")) {
      return res.status(403).json({
        message: "Only guard can mark entry"
      });
    }

    /* =====================================================
       🚫 STATUS CHECK
    ===================================================== */

    if (visitor.status !== "APPROVED") {
      return res.status(400).json({
        message: "Visitor not approved yet"
      });
    }

    /* =====================================================
       🔒 OPTIONAL: SAME GUARD CHECK (STRICT MODE)
       (Uncomment if you want only same guard)
    ===================================================== */
    /*
    if (visitor.guardId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only assigned guard can mark entry"
      });
    }
    */

    /* =====================================================
       ✅ MARK ENTRY
    ===================================================== */

    visitor.status = "ENTERED";
    visitor.checkInAt = new Date();

    await visitor.save();

    /* =====================================================
       📲 NOTIFY RESIDENT + GUARD
    ===================================================== */

    try {
      const guard = await User.findById(visitor.guardId);

      const tokens = [
        ...getUserTokens(visitor.residentId),
        ...getUserTokens(guard)
      ];

      if (tokens.length > 0) {
        await sendPushNotificationToMany(
          tokens,
          "Visitor Entered ✅",
          `${visitor.personName} has entered for Flat ${visitor.wing}-${visitor.flatNo}`,
          {
            type: "VISITOR_ENTERED",
            visitorId: visitor._id.toString()
          }
        );
      }
    } catch (pushError) {
      console.error("Push Notification Error:", pushError);
    }

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    res.json({
      success: true,
      message: "Visitor entered successfully",
      visitor
    });

  } catch (error) {
    console.error("ENTER VISITOR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
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
    const { userId, societyId, roles } = req.user;

    /* =====================================================
       🔍 STEP 1: Find Visitor
    ===================================================== */

    const visitor = await VisitorLog.findById(id).populate("residentId");

    if (!visitor) {
      return res.status(404).json({
        message: "Visitor not found"
      });
    }

    /* =====================================================
       🔒 SECURITY: SAME SOCIETY CHECK
    ===================================================== */

    if (visitor.societyId.toString() !== societyId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    /* =====================================================
       🔒 ROLE CHECK (ONLY GUARD)
    ===================================================== */

    if (!roles.includes("GUARD")) {
      return res.status(403).json({
        message: "Only guard can mark exit"
      });
    }

    /* =====================================================
       🚫 STATUS CHECK
    ===================================================== */

    if (visitor.status !== "ENTERED") {
      return res.status(400).json({
        message: "Visitor has not entered yet"
      });
    }

    /* =====================================================
       🔒 OPTIONAL: SAME GUARD CHECK (STRICT MODE)
    ===================================================== */
    /*
    if (visitor.guardId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only assigned guard can mark exit"
      });
    }
    */

    /* =====================================================
       ✅ MARK EXIT
    ===================================================== */

    visitor.status = "EXITED";
    visitor.checkOutAt = new Date();

    await visitor.save();

    /* =====================================================
       📲 NOTIFY RESIDENT + GUARD
    ===================================================== */

    try {
      const guard = await User.findById(visitor.guardId);

      const tokens = [
        ...getUserTokens(visitor.residentId),
        ...getUserTokens(guard)
      ];

      if (tokens.length > 0) {
        await sendPushNotificationToMany(
          tokens,
          "Visitor Exited 🚶",
          `${visitor.personName} has exited from Flat ${visitor.wing}-${visitor.flatNo}`,
          {
            type: "VISITOR_EXITED",
            visitorId: visitor._id.toString()
          }
        );
      }
    } catch (pushError) {
      console.error("Push Notification Error:", pushError);
    }

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    res.json({
      success: true,
      message: "Visitor exited successfully",
      visitor
    });

  } catch (error) {
    console.error("EXIT VISITOR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
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

    const pageNumber = Math.max(parseInt(page) || 1, 1);
    const limitNumber = Math.min(parseInt(limit) || 20, 100); // 🔒 max limit protection
    const skip = (pageNumber - 1) * limitNumber;

    /* =====================================================
       🔍 STEP 1: Fetch User
    ===================================================== */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    /* =====================================================
       🧠 STEP 2: BUILD FILTER
    ===================================================== */

    let filter = { societyId };

    /* =========================
       👤 RESIDENT (OWNER/TENANT)
    ========================= */

    if (roles.includes("OWNER") || roles.includes("TENANT")) {
      filter.flatNo = normalizeFlatNo(user.flatNo);
      filter.wing = user.wing; // ✅ IMPORTANT (multi-wing security)
    }

    /* =========================
       🛡 GUARD
    ========================= */

    else if (roles.includes("GUARD")) {
      filter.guardId = userId;
    }

    /* =========================
       🏢 ADMIN
    ========================= */

    else if (roles.includes("ADMIN")) {
      // admin sees all society visitors (no extra filter)
    }

    /* =========================
       🚫 UNKNOWN ROLE
    ========================= */

    else {
      return res.status(403).json({
        success: false,
        message: "Unauthorized role"
      });
    }

    /* =====================================================
       🔎 STATUS FILTER
    ===================================================== */

    if (status) {
      filter.status = status.trim().toUpperCase();
    }

    /* =====================================================
       📊 STEP 3: FETCH DATA
    ===================================================== */

    const total = await VisitorLog.countDocuments(filter);

    const visitors = await VisitorLog.find(filter)
      .populate("guardId", "name mobile")
      .populate("approvedBy", "name roles")
      .populate("residentId", "name flatNo wing") // ✅ useful for admin UI
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    return res.json({
      success: true,
      data: visitors,
      currentPage: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
      total,
      hasMore: pageNumber * limitNumber < total
    });

  } catch (error) {
    console.error("GET VISITORS ERROR:", error);

    return res.status(500).json({
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
    const { societyId, roles } = req.user;
    let { wing } = req.query;

    /* =====================================================
       🔒 ROLE CHECK (ONLY GUARD / ADMIN)
    ===================================================== */

    if (!roles.includes("GUARD") && !roles.includes("ADMIN")) {
      return res.status(403).json({
        message: "Only guard or admin can access flats"
      });
    }

    /* =====================================================
       🔤 NORMALIZE WING
    ===================================================== */

    if (wing) {
      wing = wing.trim().toUpperCase();
    }

    /* =====================================================
       📍 STEP 1: GET WINGS
    ===================================================== */

    if (!wing) {

      const wings = await User.distinct("wing", {
        societyId,
        roles: { $in: ["OWNER"] },
        status: "ACTIVE", // ✅ IMPORTANT
        wing: { $ne: null }
      });

      const sortedWings = wings.sort();

      return res.json({
        success: true,
        type: "WINGS",
        data: sortedWings.map(w => ({ wing: w }))
      });
    }

    /* =====================================================
       📍 STEP 2: GET FLATS BY WING
    ===================================================== */

    const owners = await User.find(
      {
        societyId,
        wing,
        roles: { $in: ["OWNER"] },
        status: "ACTIVE", // ✅ IMPORTANT
        flatNo: { $ne: null }
      },
      { flatNo: 1, wing: 1, name: 1 }
    ).lean();

    /* =====================================================
       🔢 SMART SORT (FIX STRING SORT ISSUE)
    ===================================================== */

    const sortedFlats = owners.sort((a, b) => {
      return a.flatNo.localeCompare(b.flatNo, undefined, {
        numeric: true,
        sensitivity: "base"
      });
    });

    /* =====================================================
       ⚠ EMPTY STATE
    ===================================================== */

    if (!sortedFlats.length) {
      return res.json({
        success: true,
        type: "FLATS",
        data: [],
        message: "No flats found for this wing"
      });
    }

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    return res.json({
      success: true,
      type: "FLATS",
      data: sortedFlats.map(o => ({
        wing: o.wing,
        flatNo: o.flatNo,
        ownerName: o.name
      }))
    });

  } catch (error) {
    console.error("GET SOCIETY FLATS ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch data"
    });
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
    const { userId, societyId, roles } = req.user;

    /* =====================================================
       🔒 ROLE CHECK (ONLY OWNER / TENANT)
    ===================================================== */

    if (
      !roles.includes("OWNER") &&
      !roles.includes("TENANT")
    ) {
      return res.status(403).json({
        message: "Only residents can create pre-approved guests"
      });
    }

    /* =====================================================
       🧾 VALIDATION
    ===================================================== */

    if (!guestName || !guestMobile) {
      return res.status(400).json({
        message: "Guest name and mobile required"
      });
    }

    const normalizedMobile = guestMobile.trim();

    /* =====================================================
       🔍 FETCH RESIDENT
    ===================================================== */

    const resident = await User.findById(userId);

    if (!resident || !resident.societyId) {
      return res.status(404).json({
        message: "Resident not found"
      });
    }

    /* =====================================================
       🔒 SOCIETY SAFETY
    ===================================================== */

    if (resident.societyId.toString() !== societyId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    if (!resident.flatNo || !resident.wing) {
      return res.status(400).json({
        message: "Flat or wing not assigned"
      });
    }

    /* =====================================================
       🚫 PREVENT DUPLICATE ACTIVE OTP
    ===================================================== */

    const existing = await VisitorLog.findOne({
      societyId,
      flatNo: resident.flatNo,
      wing: resident.wing,
      personMobile: normalizedMobile,
      otpStatus: "ACTIVE"
    });

    if (existing) {
      return res.status(409).json({
        message: "Guest already has an active OTP"
      });
    }

    /* =====================================================
       🔐 GENERATE OTP (SAFE LOOP)
    ===================================================== */

    let otp;
    let isUnique = false;

    while (!isUnique) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();

      const existingOtp = await VisitorLog.findOne({
        otp,
        otpStatus: "ACTIVE"
      });

      if (!existingOtp) isUnique = true;
    }

    /* =====================================================
       📝 CREATE ENTRY
    ===================================================== */

    const visitor = await VisitorLog.create({
      societyId,
      residentId: resident._id,
      wing: resident.wing,
      flatNo: resident.flatNo,
      personName: guestName,
      personMobile: normalizedMobile,
      entryType: "GUEST",
      otp,
      otpStatus: "ACTIVE",
      otpExpiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      createdByResident: resident._id,
      status: "APPROVED"
    });

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    return res.status(201).json({
      success: true,
      message: "Guest pre-approved successfully",
      otp,
      visitorId: visitor._id
    });

  } catch (error) {
    console.error("PRE-APPROVED GUEST ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
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
    const { societyId, roles } = req.user;

    /* =====================================================
       🔒 ROLE CHECK (ONLY GUARD)
    ===================================================== */

    if (!roles.includes("GUARD")) {
      return res.status(403).json({
        message: "Only guard can verify OTP"
      });
    }

    /* =====================================================
       🧾 VALIDATION
    ===================================================== */

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required"
      });
    }

    /* =====================================================
       🔍 FIND VISITOR (WITH SOCIETY SAFETY)
    ===================================================== */

    const visitor = await VisitorLog.findOne({
      otp,
      societyId, // 🔒 IMPORTANT
      otpStatus: "ACTIVE",
      status: "APPROVED"
    }).populate("residentId");

    if (!visitor) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      });
    }

    /* =====================================================
       ⏰ EXPIRY CHECK
    ===================================================== */

    if (visitor.otpExpiresAt < new Date()) {
      visitor.otpStatus = "EXPIRED";
      await visitor.save();

      return res.status(400).json({
        message: "OTP expired"
      });
    }

    /* =====================================================
       🔐 MARK OTP AS VERIFIED (IMPORTANT)
    ===================================================== */

    visitor.otpStatus = "VERIFIED"; // 🔥 NEW
    visitor.otpVerifiedAt = new Date();

    await visitor.save();

    /* =====================================================
       📲 NOTIFY RESIDENT
    ===================================================== */

    try {
      const tokens = getUserTokens(visitor.residentId);

      if (tokens.length > 0) {
        await sendPushNotificationToMany(
          tokens,
          "Guest Arrived 🚪",
          `${visitor.personName} has verified OTP at the gate`,
          {
            type: "OTP_VERIFIED",
            visitorId: visitor._id.toString()
          }
        );
      }
    } catch (pushError) {
      console.error("Push Notification Error:", pushError);
    }

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    return res.json({
      success: true,
      message: "OTP verified successfully",
      visitor: {
        id: visitor._id,
        guestName: visitor.personName,
        wing: visitor.wing,
        flatNo: visitor.flatNo,
        residentName: visitor.residentId?.name || null
      }
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      message: "Server error"
    });
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
    const { societyId, roles, userId } = req.user;

    /* =====================================================
       🔒 ROLE CHECK (ONLY GUARD)
    ===================================================== */

    if (!roles.includes("GUARD")) {
      return res.status(403).json({
        message: "Only guard can allow entry"
      });
    }

    /* =====================================================
       🔍 FIND VISITOR
    ===================================================== */

    const visitor = await VisitorLog.findById(id).populate("residentId");

    if (!visitor) {
      return res.status(404).json({
        message: "Guest not found"
      });
    }

    /* =====================================================
       🔒 SOCIETY CHECK
    ===================================================== */

    if (visitor.societyId.toString() !== societyId.toString()) {
      return res.status(403).json({
        message: "Unauthorized access"
      });
    }

    /* =====================================================
       🚫 STATUS VALIDATION
    ===================================================== */

    if (visitor.status !== "APPROVED") {
      return res.status(400).json({
        message: "Visitor is not approved"
      });
    }

    /* =====================================================
       🔐 OTP FLOW FIX (CRITICAL)
    ===================================================== */

    if (visitor.otpStatus !== "VERIFIED") {
      return res.status(400).json({
        message: "OTP not verified or already used"
      });
    }

    /* =====================================================
       🔒 OPTIONAL: SAME GUARD CHECK
    ===================================================== */
    /*
    if (visitor.guardId && visitor.guardId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Only assigned guard can allow entry"
      });
    }
    */

    /* =====================================================
       ✅ MARK ENTRY
    ===================================================== */

    visitor.status = "ENTERED";
    visitor.otpStatus = "USED";
    visitor.checkInAt = new Date();

    await visitor.save();

    /* =====================================================
       📲 NOTIFY RESIDENT
    ===================================================== */

    try {
      const tokens = getUserTokens(visitor.residentId);

      if (tokens.length > 0) {
        await sendPushNotificationToMany(
          tokens,
          "Guest Entered 🚪",
          `${visitor.personName} has entered Flat ${visitor.wing}-${visitor.flatNo}`,
          {
            type: "OTP_GUEST_ENTERED",
            visitorId: visitor._id.toString()
          }
        );
      }
    } catch (pushError) {
      console.error("Push Notification Error:", pushError);
    }

    /* =====================================================
       ✅ RESPONSE
    ===================================================== */

    res.json({
      success: true,
      message: "Guest entered successfully",
      visitorId: visitor._id
    });

  } catch (error) {
    console.error("ALLOW OTP ENTRY ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};