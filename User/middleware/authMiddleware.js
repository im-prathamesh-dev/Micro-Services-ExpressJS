const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

module.exports.authenticate = async (req, res, next) => {
    try {
        console.log("\n================ AUTH MIDDLEWARE ================");
        console.log("➡️  Method:", req.method);
        console.log("➡️  URL:", req.originalUrl);

        console.log("➡️  Headers:", req.headers);
        console.log("➡️  Cookies:", req.cookies);

        const authHeader = req.headers.authorization;
        console.log("➡️  Authorization header:", authHeader);

        const token =
            req.cookies?.token ||
            authHeader?.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : null;

        console.log("➡️  Extracted token:", token);

        if (!token) {
            console.log("❌ FAIL: Token not found");
            console.log("================================================\n");
            return res.status(401).json({ message: 'Unauthorized - Token missing' });
        }

        console.log("🔑 JWT_SECRET exists:", !!process.env.JWT_SECRET);

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("✅ Token verified");
        } catch (jwtError) {
            console.log("❌ JWT verify failed:", jwtError.message);
            console.log("================================================\n");
            return res.status(401).json({
                message: 'Unauthorized - Invalid or expired token',
                error: jwtError.message
            });
        }

        console.log("📦 Decoded payload:", decoded);

        const user = await userModel
            .findById(decoded.userId)
            .select('-password');

        console.log("👤 User fetched from DB:", user);

        if (!user) {
            console.log("❌ FAIL: User not found in DB");
            console.log("================================================\n");
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }

        req.user = user;
        console.log("✅ SUCCESS: User attached to req");
        console.log("================================================\n");

        next();

    } catch (error) {
        console.error("🔥 AUTH MIDDLEWARE CRASH:", error);
        console.log("================================================\n");
        return res.status(401).json({ message: 'Unauthorized - Middleware error' });
    }
};