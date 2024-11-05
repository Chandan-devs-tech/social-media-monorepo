// const jwt = require("jsonwebtoken");

// // Authentication Middleware
// const authenticateToken = (req, res, next) => {
//   // Step 1: Get the token from the Authorization header
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   // Step 2: If no token is found, return an error
//   if (!token) {
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });
//   }

//   // Step 3: Verify the token
//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: "Invalid token." });
//     }

//     // Step 4: Add user information to the request object
//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;

const jwt = require("jsonwebtoken");
const db = require("../config/db");

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  // Step 1: Get the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Step 2: If no token is found, return an error
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  // Step 3: Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    const userId = decoded.userId;

    // Step 4: Fetch user details from the database using userId
    db.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
      if (error) {
        return res.status(500).json({ message: "Database error", error });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];
      // Step 5: Add full user information (including name) to req.user
      req.user = {
        userId: user.id,
        name: user.username,
        email: user.email,
      };

      next();
    });
  });
};

module.exports = authenticateToken;
