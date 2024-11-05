const db = require("../config/db");

// Create Notifications Table
const createNotificationsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      message VARCHAR(255) NOT NULL,
      type ENUM('like', 'comment', 'follow') NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating notifications table:", err.message);
    } else {
      console.log("Notifications table created or already exists");
    }
  });
};

module.exports = { createNotificationsTable };
