export const checkGuardShift = (req, res, next) => {
    try {
        const user = req.user;

      // Only apply shift check for guards
      if (!user.roles?.includes("GUARD")) {
          return next();
      }

      // If shift times are missing, skip check (prevents crash)
      if (!user.shiftStartTime || !user.shiftEndTime) {
          console.warn("Guard shift not configured for:", user._id);
          return next();
      }

      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const [startHour, startMin] = user.shiftStartTime.split(":").map(Number);
      const [endHour, endMin] = user.shiftEndTime.split(":").map(Number);

      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      let isAllowed = false;

      // Normal shift
      if (startTime < endTime) {
          isAllowed = currentTime >= startTime && currentTime <= endTime;
      }
      // Night shift (cross midnight)
      else {
          isAllowed = currentTime >= startTime || currentTime <= endTime;
      }

      if (!isAllowed) {
          return res.status(403).json({
              success: false,
              message: "You can use this feature only during your shift"
      });
    }

      next();

  } catch (error) {
      console.error("Shift check error:", error);
      res.status(500).json({
          success: false,
          message: "Shift validation failed"
    });
  }
};