const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  }
);

// TTL index (MongoDB will auto-delete after 1 hour)
blacklistTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 3600 }
);

// 🔥 THIS LINE WAS MISSING
module.exports = mongoose.model(
  "BlacklistToken",
  blacklistTokenSchema
);