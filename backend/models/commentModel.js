const db = require("../config/db");

// Create Comments Table
const createCommentsTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      post_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating comments table:", err.message);
    } else {
      console.log("Comments table created or already exists");
    }
  });
};

module.exports = { createCommentsTable };
