import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Society from "../models/Society.js";

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    // 1️⃣ Verify JWT
    const decoded = verifyToken(token);

    // 2️⃣ Fetch user from DB
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 3️⃣ Fetch society (if exists)
    let society = null;
    if (user.societyId) {
      society = await Society.findById(user.societyId);
    }

    // 4️⃣ Combined blocking check
    if (
      user.status === "BLOCKED" ||
      society?.status === "BLOCKED"
    ) {
      return res.status(403).json({
        message:
          user.status === "BLOCKED"
            ? "Your account has been blocked"
            : "Your society access has been suspended"
      });
    }

    // 5️⃣ Attach clean user object to request
    req.user = {
      userId: user._id,
      roles: user.roles,
      societyId: user.societyId,
    };

    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
