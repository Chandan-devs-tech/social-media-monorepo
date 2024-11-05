const db = require("../config/db");

// Create Notification Controller
const createNotification = (userId, actionUserId, type, postId = null) => {
  // Insert notification into the database
  db.query(
    "INSERT INTO notifications (user_id, action_user_id, type, post_id) VALUES (?, ?, ?, ?)",
    [userId, actionUserId, type, postId],
    (err, results) => {
      if (err) {
        console.error("Failed to create notification:", err);
      }
    }
  );
};

// Get Notifications for a User
const getNotifications = (req, res) => {
  const userId = req.user.userId;

  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      return res.status(200).json({ notifications: results });
    }
  );
};

module.exports = { createNotification, getNotifications };
