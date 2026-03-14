const rideModel = require('../models/ride.model');
const { publishMessage, consumeMessage } = require('../services/rabbit');

module.exports.createRide = async (req, res) => {
    try {
        const { pickup, destination } = req.body;
        const userId = req.user.userId; // From User service JWT

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const newRide = new rideModel({
            pickup,
            destination,
            userId
        });

        await newRide.save();
        publishMessage('ride_created', newRide);

        res.status(201).json({
            message: 'Ride created successfully',
            ride: {
                ...newRide._doc,
                rideId: newRide._id
            }
        });
    } catch (error) {
        console.error("🔥 Create Ride error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.acceptRide = async (req, res) => {
    try {
        const { rideId } = req.body;
        const captainId = req.user.captainId; // From Captain service JWT

        if (!captainId) {
            return res.status(400).json({ message: 'Captain ID is required' });
        }

        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status !== 'pending') {
            return res.status(400).json({ message: 'Ride is already ' + ride.status });
        }

        ride.status = 'accepted';
        ride.captain = captainId;
        await ride.save();

        publishMessage('ride_accepted', { rideId, captainId });

        res.status(200).json({
            message: 'Ride accepted successfully',
            ride
        });
    } catch (error) {
        console.error("🔥 Accept Ride error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};