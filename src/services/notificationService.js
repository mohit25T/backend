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
  console.log("Message to send:", message);

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
  data = {}
) {
  // Remove empty / duplicate tokens
  const uniqueTokens = [...new Set(tokens)].filter(Boolean);

  if (uniqueTokens.length === 0) return;

  const message = {
    tokens: uniqueTokens,
    notification: {
      title,
      body,
    },
    data,
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);

    // Optional: log failures (useful for cleanup later)
    if (response.failureCount > 0) {
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(
            "❌ Failed FCM token:",
            uniqueTokens[idx],
            resp.error?.message
          );
        }
      });
    }
  } catch (error) {
    console.error("🔥 FCM MULTICAST ERROR:", error);
  }
}

