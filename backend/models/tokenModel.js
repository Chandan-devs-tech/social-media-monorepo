const db = require("../config/db");

// Create Tokens Table
const createTokensTable = () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating tokens table:", err.message);
    } else {
      console.log("Tokens table created or already exists");
    }
  });
};

module.exports = { createTokensTable };
