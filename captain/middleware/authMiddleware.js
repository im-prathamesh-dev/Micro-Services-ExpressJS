const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const CaptainModel = require("../models/captain.model");
const BlacklistToken = require("../models/blacklisttoken.model");

module.exports.authenticate = async (req, res, next) => {
  try {
    console.log("\n=========== AUTH MIDDLEWARE ===========");
    console.log("🗄️ DB:", mongoose.connection.name);

    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const blacklisted = await BlacklistToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token blacklisted" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("📦 JWT payload:", decoded);

    if (!decoded.captainId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const Captain = await CaptainModel
      .findById(decoded.captainId)
      .select("-password");

    if (!Captain) {
      console.log("❌ Captain ID NOT FOUND IN DB");
      return res.status(401).json({
        message: "Captain not found in this service database"
      });
    }

    req.Captain = Captain;
    console.log("✅ Captain authenticated:", Captain.email);
    console.log("======================================\n");

    next();
  } catch (err) {
    console.error("🔥 AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};