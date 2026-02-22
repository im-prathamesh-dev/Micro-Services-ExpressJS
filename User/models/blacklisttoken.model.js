const mongoose = require('mongoose');
const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
}, {
    expireAfterSeconds: 3600, // TTL: Auto-delete documents 1 hour after expiresAt
});

// Create TTL index
blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });