const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklisttokenModel = require('../models/blacklisttoken.model');
module.exports.register = async (req, res) => {
    try {
        console.log("📥 Register request received");
        console.log("Request body:", req.body);

        const { name, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        console.log("🔍 Existing user:", existingUser);

        if (existingUser) {
            console.log("❌ User already exists");
            return res.status(400).json({ message: 'User already exists' });
        }

        if (!password) {
            console.log("❌ Password missing in request");
            return res.status(400).json({ message: 'Password is required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Hashed password created");

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();
        console.log("💾 User saved to DB:", newUser._id);

        console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);

        const token = jwt.sign(
            { userId: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("🎟 Token generated");

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });

        console.log("🍪 Cookie set");

        res.status(201).json({
            token,
            newUser
        });

    } catch (error) {
        console.error("🔥 Register error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("📥 Login request received");
        console.log("Email:", email);
        console.log("Password entered:", password);

        const user = await userModel.findOne({ email });

        console.log("👤 User from DB:", user);

        if (!user) {
            console.log("❌ No user found with this email");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log("🔐 Stored hashed password:", user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("✅ Password match result:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("❌ Password mismatch");
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("🎟 Token generated successfully");

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false
        });

        console.log("🍪 Cookie set successfully");

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("🔥 Login error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};  
module.exports.logout = async (req, res) => {
    try {
        console.log("📥 Logout request");

        const token = req.cookies.token;
        console.log("🍪 Token from cookie:", token);

        if (!token) {
            console.log("❌ No token found");
            return res.status(401).json({ message: 'Unauthorized' });
        }

        await blacklisttokenModel.create({ token });
        console.log("🚫 Token blacklisted");

        res.clearCookie('token');
        console.log("🧹 Cookie cleared");

        res.status(200).json({ message: 'Logout successful' });

    } catch (error) {
        console.error("🔥 Logout error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        console.log("📥 Get profile request");
        console.log("👤 Authenticated user:", req.user);

        res.status(200).json(req.user);

    } catch (error) {
        console.error("🔥 GetProfile error:", error);
        res.status(500).json({ message: error.message });
    }
};