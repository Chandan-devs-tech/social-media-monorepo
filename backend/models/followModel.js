const db = require("../config/db");

// Create Follows Table
const createFollowsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS follows (
      id INT AUTO_INCREMENT PRIMARY KEY,
      follower_id INT NOT NULL,
      followed_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE (follower_id, followed_id)
    );
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating follows table:", err.message);
    } else {
      console.log("Follows table created or already exists");
    }
  });
};

module.exports = { createFollowsTable };
