const db = require("../config/db");

// Create Posts Table
const createPostsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating posts table:", err.message);
    } else {
      console.log("Posts table created or already exists");
    }
  });
};

module.exports = { createPostsTable };
