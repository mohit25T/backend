import admin from "../config/firebase.js";

/**
 * =====================================================
 * 🔔 Send notification to a SINGLE device (OLD - KEEP)
 * =====================================================
 * Used for backward compatibility
 */
export async function sendPushNotification(
  token,
  title,
  body,
  data = {}
) {
  if (!token) return;

  const message = {
    token,
    notification: {
      title,
      body,
    },
    data,
  };

  await admin.messaging().send(message);
}

/**
 * =====================================================
 * 🔔 Send notification to MULTIPLE devices (NEW)
 * =====================================================
 * - Supports resident + guard
 * - Supports multiple devices per user
 * - Filters invalid tokens automatically
 */
export async function sendPushNotificationToMany(
  tokens = [],
  title,
  body,
  data = {},
  sound = "default" // ✅ ADD THIS
) {
  const uniqueTokens = [...new Set(tokens)].filter(Boolean);

  if (uniqueTokens.length === 0) {
    console.log("⚠️ No valid FCM tokens found");
    return null;
  }

  // 🔥 FORCE STRING VALUES
  const stringifiedData = {};
  Object.keys(data).forEach((key) => {
    stringifiedData[key] = String(data[key]);
  });

  const message = {
    tokens: uniqueTokens,

    notification: {
      title,
      body,
    },

    data: {
      ...stringifiedData,
      click_action: "FLUTTER_NOTIFICATION_CLICK",
    },

    android: {
      priority: "high",
      notification: {
        sound: "sos_alarm", // ✅ IMPORTANT
        channelId: "sos_channel", // must match Flutter
      },
    },

    apns: {
      payload: {
        aps: {
          sound: sound === "default" ? "default" : `${sound}.mp3`, // ✅ iOS
        },
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    console.log("✅ FCM multicast response:", {
      successCount: response.successCount,
      failureCount: response.failureCount,
    });

    return response;

  } catch (error) {
    console.error("🔥 FCM MULTICAST ERROR:", error);
    throw error;
  }
}