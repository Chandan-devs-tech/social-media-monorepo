const db = require("../config/db");

// Create Likes Table
const createLikesTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS likes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      post_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      UNIQUE (user_id, post_id)
    );
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating likes table:", err.message);
    } else {
      console.log("Likes table created or already exists");
    }
  });
};

module.exports = { createLikesTable };
