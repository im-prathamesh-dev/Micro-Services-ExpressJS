const CaptainModel = require("../models/captain.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklisttoken.model");

/* =========================
   REGISTER CAPTAIN
========================= */
module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingCaptain = await CaptainModel.findOne({ email });
    if (existingCaptain) {
      return res.status(400).json({ message: "Captain already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newCaptain = await CaptainModel.create({
      name,
      email,
      password: hashedPassword,
      isAvailable: false, // 🔒 explicit (even if schema default exists)
    });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { captainId: newCaptain._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(201).json({
      message: "Captain registered successfully",
      token,
      captain: {
        id: newCaptain._id,
        name: newCaptain.name,
        email: newCaptain.email,
        isAvailable: newCaptain.isAvailable,
      },
    });
  } catch (error) {
    console.error("🔥 Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN CAPTAIN
========================= */
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const Captain = await CaptainModel.findOne({ email });
    if (!Captain) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, Captain.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 🛡 Backfill old DB records
    if (Captain.isAvailable === undefined) {
      Captain.isAvailable = false;
      await Captain.save();
    }

    const token = jwt.sign(
      { captainId: Captain._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      captain: {
        id: Captain._id,
        name: Captain.name,
        email: Captain.email,
        isAvailable: Captain.isAvailable,
      },
    });
  } catch (error) {
    console.error("🔥 Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGOUT CAPTAIN
========================= */
module.exports.logout = async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await BlacklistToken.create({ token });

    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("🔥 Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET CAPTAIN PROFILE
========================= */
module.exports.getProfile = async (req, res) => {
  try {
    if (!req.Captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const Captain = await CaptainModel.findById(req.Captain._id).select(
      "-password"
    );

    if (!Captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    // 🛡 Backfill safety
    if (Captain.isAvailable === undefined) {
      Captain.isAvailable = false;
      await Captain.save();
    }

    res.status(200).json(Captain);
  } catch (error) {
    console.error("🔥 GetProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   TOGGLE AVAILABILITY
========================= */
module.exports.toggleAvailability = async (req, res) => {
  try {
    if (!req.Captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const Captain = await CaptainModel.findById(req.Captain._id);

    if (!Captain) {
      return res.status(404).json({ message: "Captain not found" });
    }

    Captain.isAvailable = !Captain.isAvailable;
    await Captain.save();

    res.status(200).json({
      message: "Availability updated",
      isAvailable: Captain.isAvailable,
    });
  } catch (error) {
    console.error("🔥 Toggle availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};