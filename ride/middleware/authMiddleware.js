const jwt = require('jsonwebtoken');
const riderModel = require('../models/rider.model');
const blacklisttokenModel = require('../models/blacklisttoken.model');

module.exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token =
            req.cookies?.token ||
            (authHeader?.startsWith('Bearer ')
                ? authHeader.split(' ')[1]
                : null);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - Token missing' });
        }

        const isBlacklisted = await blacklisttokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized - Token is blacklisted' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach any available ID from the token (userId or captainId)
        req.user = decoded;
        next();

    } catch (error) {
        console.error("🔥 RIDE AUTH ERROR:", error.message);
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};
