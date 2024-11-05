const db = require("../config/db");

const addNotification = (userId, message, type, io) => {
  return new Promise((resolve, reject) => {
    const createQuery =
      "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)";
    db.query(createQuery, [userId, message, type], (err, results) => {
      if (err) {
        return reject(err);
      }

      // Emit notification event if user is connected
      io.to(userId.toString()).emit("notification", {
        id: results.insertId,
        message,
        type,
        is_read: false,
        created_at: new Date(),
      });

      resolve(results);
    });
  });
};

module.exports = { addNotification };
