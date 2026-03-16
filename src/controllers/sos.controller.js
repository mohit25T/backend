import SOS from "../models/SOS.js";
import User from "../models/User.js";
import {
    sendPushNotification,
    sendPushNotificationToMany
} from "../services/notificationService.js";
import { getUserTokens } from "../utils/getUserTokens.js";


// 🚨 Trigger SOS
export const triggerSOS = async (req, res) => {
  try {

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

      /* =====================================
         SEND NOTIFICATIONS
      ===================================== */

      // 1️⃣ Notify Guards
      const guards = await User.find({
          societyId,
          roles: "GUARD"
      });

      if (guards.length > 0) {
          await sendPushNotificationToMany(
              getUserTokens(guards),
              "🚨 SOS Emergency",
              `Emergency at Wing ${wing} Flat ${flatNo}`,
              {
                  type: "SOS_ALERT",
                  sosId: sos._id.toString()
              }
          );
      }

      // 2️⃣ Notify Admins
      const admins = await User.find({
          societyId,
          roles: "ADMIN"
      });

      if (admins.length > 0) {
          await sendPushNotificationToMany(
              getUserTokens(admins),
              "🚨 SOS Alert",
              `Resident triggered SOS at Wing ${wing} Flat ${flatNo}`,
              {
                  type: "SOS_ALERT",
                  sosId: sos._id.toString()
              }
          );
      }

      // 3️⃣ Notify Neighbours (same wing residents)
      const neighbours = await User.find({
          societyId,
          wing,
          roles: { $in: ["OWNER", "TENANT"] }
      });

      if (neighbours.length > 0) {
          await sendPushNotificationToMany(
              getUserTokens(neighbours),
              "⚠ Emergency Nearby",
              `Flat ${flatNo} triggered SOS in your wing`,
              {
                  type: "NEIGHBOUR_SOS_ALERT",
                  sosId: sos._id.toString()
              }
          );
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



// 🚨 Get Active SOS (Guard Dashboard)
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



// 🛡 Guard Respond
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

      /* =============================
         SEND NOTIFICATION
      ============================= */

      const resident = await User.findById(sos.userId._id);

      const admins = await User.find({
          societyId: sos.societyId,
          roles: "ADMIN"
      });

      const guard = await User.findById(req.user.userId);

      // Notify resident
      if (resident) {
          await sendPushNotificationToMany(
              getUserTokens([resident]),
              "👮 Guard Responding",
              `Guard ${guard.name} is responding to your SOS`,
              {
                  type: "SOS_RESPONDING",
                  sosId: sos._id.toString()
              }
          );
      }

      // Notify admins
      if (admins.length > 0) {
          await sendPushNotificationToMany(
              getUserTokens(admins),
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



// ✅ Resolve SOS
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

    /* =============================
       SEND NOTIFICATION
    ============================= */

    const resident = await User.findById(sos.userId._id);

    const admins = await User.find({
      societyId: sos.societyId,
      roles: "ADMIN"
    });

    const neighbours = await User.find({
      societyId: sos.societyId,
      wing: sos.wing,
      roles: { $in: ["OWNER", "TENANT"] }
    });

    // Notify resident
    if (resident) {
      await sendPushNotificationToMany(
        getUserTokens([resident]),
        "✅ SOS Resolved",
        `Your SOS request has been resolved`,
        {
          type: "SOS_RESOLVED",
          sosId: sos._id.toString()
        }
      );
    }

    // Notify admins
    if (admins.length > 0) {
      await sendPushNotificationToMany(
        getUserTokens(admins),
        "✅ SOS Resolved",
        `SOS at Wing ${sos.wing} Flat ${sos.flatNo} has been resolved`,
        {
          type: "SOS_RESOLVED",
          sosId: sos._id.toString()
        }
      );
    }

    // Notify neighbours
    if (neighbours.length > 0) {
      await sendPushNotificationToMany(
        getUserTokens(neighbours),
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



// 📊 SOS History (Admin Panel)
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