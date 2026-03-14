const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    pickup: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        // We don't have a cross-service ref easily, but we can store the ID
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled'],
        default: 'pending',
    }
}, { timestamps: true });

module.exports = mongoose.model('ride', rideSchema);
