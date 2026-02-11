import admin from "../config/firebase.js";

/**
 * =====================================================
 * 🔔 Send notification to a SINGLE device (OLD - KEEP)
 * =====================================================
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

    // 🔥 ADDED SECTION (no other changes)
    android: {
      priority: "high",
      notification: {
        channelId: "visitor_alerts",
        sound: "default",
        priority: "high",
        defaultVibrateTimings: true,
        defaultSound: true,
      },
    },

    apns: {
      payload: {
        aps: {
          sound: "default",
          contentAvailable: true,
        },
      },
    },
  };

  await admin.messaging().send(message);
}

/**
 * =====================================================
 * 🔔 Send notification to MULTIPLE devices (NEW)
 * =====================================================
 */
export async function sendPushNotificationToMany(
  tokens = [],
  title,
  body,
  data = {}
) {
  const uniqueTokens = [...new Set(tokens)].filter(Boolean);

  if (uniqueTokens.length === 0) {
    console.log("⚠️ No valid FCM tokens found");
    return null;
  }

  const message = {
    tokens: uniqueTokens,
    notification: {
      title,
      body,
    },
    data,

    // 🔥 ADDED SECTION (no other changes)
    android: {
      priority: "high",
      notification: {
        channelId: "visitor_alerts",
        sound: "default",
        priority: "high",
        defaultVibrateTimings: true,
        defaultSound: true,
      },
    },

    apns: {
      payload: {
        aps: {
          sound: "default",
          contentAvailable: true,
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

    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(
            "❌ Failed token:",
            uniqueTokens[idx],
            resp.error?.message
          );
        }
      });
    }

    return response;

  } catch (error) {
    console.error("🔥 FCM MULTICAST ERROR:", error);
    throw error;
  }
}
