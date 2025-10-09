const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports.verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    console.error("❌ Token verification failed:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};
