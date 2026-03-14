const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware.authenticate, rideController.createRide);
router.post('/accept', authMiddleware.authenticate, rideController.acceptRide);

module.exports = router;
