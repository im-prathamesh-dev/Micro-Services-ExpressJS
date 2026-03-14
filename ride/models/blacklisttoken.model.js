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

blacklistTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 3600 }
);

module.exports = mongoose.model(
  "BlacklistToken",
  blacklistTokenSchema
);
