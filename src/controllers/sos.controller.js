import SOS from "../models/SOS.js";
import User from "../models/User.js";
import { sendPushNotificationToMany } from "../services/notificationService.js";

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
 * =====================================================
 * 🚨 Trigger SOS
 * =====================================================
 */
export const triggerSOS = async (req, res) => {
  try {

    console.log("SOS REQUEST BODY:", req.body);
    console.log("AUTH USER:", req.user);

    const { wing, flatNo, emergencyType } = req.body;

    const userId = req.user.userId;
    const societyId = req.user.societyId;

    if (!wing || !flatNo) {
      return res.status(400).json({
        success: false,
        message: "Wing and flat number are required"
      });
    }

    const sos = await SOS.create({
      userId,
      societyId,
      wing,
      flatNo,
      emergencyType
    });

    console.log("New SOS Triggered:", sos);

    /* =====================================================
       📲 Notify Guards
    ===================================================== */

    const guards = await User.find({
      societyId,
      roles: "GUARD"
    });

    try {
      const guardTokens = guards.flatMap(user =>
        getUserTokens(user)
      );

      if (guardTokens.length > 0) {
        await sendPushNotificationToMany(
          guardTokens,
          "🚨 SOS Emergency",
          `Emergency at Wing ${wing} Flat ${flatNo}`,
          {
            type: "SOS_ALERT",
            sosId: sos._id.toString()
          }
        );
      }
    } catch (error) {
      console.error("Guard Notification Error:", error);
    }

    /* =====================================================
       📲 Notify Admins
    ===================================================== */

    const admins = await User.find({
      societyId,
      roles: "ADMIN"
    });

    try {
      const adminTokens = admins.flatMap(user =>
        getUserTokens(user)
      );

      if (adminTokens.length > 0) {
        await sendPushNotificationToMany(
          adminTokens,
          "🚨 SOS Alert",
          `SOS triggered at Wing ${wing} Flat ${flatNo}`,
          {
            type: "SOS_ALERT",
            sosId: sos._id.toString()
          }
        );
      }
    } catch (error) {
      console.error("Admin Notification Error:", error);
    }

    /* =====================================================
       📲 Notify Neighbours (Same Wing)
    ===================================================== */

    const neighbours = await User.find({
      societyId,
      wing,
      roles: { $in: ["OWNER", "TENANT"] }
    });

    try {
      const neighbourTokens = neighbours.flatMap(user =>
        getUserTokens(user)
      );

      if (neighbourTokens.length > 0) {
        await sendPushNotificationToMany(
          neighbourTokens,
          "⚠ Emergency Nearby",
          `SOS triggered in Wing ${wing} Flat ${flatNo}`,
          {
            type: "NEIGHBOUR_SOS_ALERT",
            sosId: sos._id.toString()
          }
        );
      }
    } catch (error) {
      console.error("Neighbour Notification Error:", error);
    }

    res.status(201).json({
      success: true,
      message: "SOS triggered successfully",
      data: sos
    });

  } catch (error) {

    console.error("SOS ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already have an active SOS request"
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * =====================================================
 * 🚨 Get Active SOS (Guard Dashboard)
 * =====================================================
 */
export const getActiveSOS = async (req, res) => {
  try {

    const societyId = req.user.societyId;

    const sosList = await SOS.find({
      societyId,
      status: { $in: ["active", "responding"] }
    })
      .populate("userId", "name phone")
      .populate("respondedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sosList.length,
      data: sosList
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * =====================================================
 * 🛡 Guard Respond
 * =====================================================
 */
export const respondSOS = async (req, res) => {
  try {

    const { id } = req.params;

    const sos = await SOS.findById(id).populate("userId");

    if (!sos) {
      return res.status(404).json({
        message: "SOS not found"
      });
    }

    sos.status = "responding";
    sos.respondedBy = req.user.userId;

    await sos.save();

    const guard = await User.findById(req.user.userId);

    /* =====================================================
       📲 Notify Resident
    ===================================================== */

    const resident = await User.findById(sos.userId._id);

    if (resident) {
      const tokens = getUserTokens(resident);

      if (tokens.length > 0) {
        await sendPushNotificationToMany(
          tokens,
          "👮 Guard Responding",
          `Guard ${guard.name} is responding to your SOS`,
          {
            type: "SOS_RESPONDING",
            sosId: sos._id.toString()
          }
        );
      }
    }

    /* =====================================================
       📲 Notify Admins
    ===================================================== */

    const admins = await User.find({
      societyId: sos.societyId,
      roles: "ADMIN"
    });

    const adminTokens = admins.flatMap(user =>
      getUserTokens(user)
    );

    if (adminTokens.length > 0) {
      await sendPushNotificationToMany(
        adminTokens,
        "👮 Guard Responding",
        `Guard ${guard.name} responding to SOS at Wing ${sos.wing} Flat ${sos.flatNo}`,
        {
          type: "SOS_RESPONDING",
          sosId: sos._id.toString()
        }
      );
    }

    res.json({
      success: true,
      message: "Guard responding to SOS",
      data: sos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * =====================================================
 * ✅ Resolve SOS
 * =====================================================
 */
export const resolveSOS = async (req, res) => {
  try {

    const { id } = req.params;

    const sos = await SOS.findById(id).populate("userId");

    if (!sos) {
      return res.status(404).json({
        message: "SOS not found"
      });
    }

    sos.status = "resolved";
    sos.resolvedAt = new Date();

    await sos.save();

    /* =====================================================
       📲 Notify Resident
    ===================================================== */

    const resident = await User.findById(sos.userId._id);

    if (resident) {
      const tokens = getUserTokens(resident);

      if (tokens.length > 0) {
        await sendPushNotificationToMany(
          tokens,
          "✅ SOS Resolved",
          "Your SOS request has been resolved",
          {
            type: "SOS_RESOLVED",
            sosId: sos._id.toString()
          }
        );
      }
    }

    /* =====================================================
       📲 Notify Admins
    ===================================================== */

    const admins = await User.find({
      societyId: sos.societyId,
      roles: "ADMIN"
    });

    const adminTokens = admins.flatMap(user =>
      getUserTokens(user)
    );

    if (adminTokens.length > 0) {
      await sendPushNotificationToMany(
        adminTokens,
        "✅ SOS Resolved",
        `SOS at Wing ${sos.wing} Flat ${sos.flatNo} has been resolved`,
        {
          type: "SOS_RESOLVED",
          sosId: sos._id.toString()
        }
      );
    }

    /* =====================================================
       📲 Notify Neighbours
    ===================================================== */

    const neighbours = await User.find({
      societyId: sos.societyId,
      wing: sos.wing,
      roles: { $in: ["OWNER", "TENANT"] }
    });

    const neighbourTokens = neighbours.flatMap(user =>
      getUserTokens(user)
    );

    if (neighbourTokens.length > 0) {
      await sendPushNotificationToMany(
        neighbourTokens,
        "✅ Emergency Cleared",
        `SOS from Flat ${sos.flatNo} has been resolved`,
        {
          type: "SOS_RESOLVED",
          sosId: sos._id.toString()
        }
      );
    }

    res.json({
      success: true,
      message: "SOS resolved successfully",
      data: sos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * =====================================================
 * 📊 SOS History (Admin Panel)
 * =====================================================
 */
export const getSOSHistory = async (req, res) => {
  try {

    const societyId = req.user.societyId;

    const history = await SOS.find({ societyId })
      .populate("userId", "name wing flatNo")
      .populate("respondedBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: history.length,
      data: history
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};