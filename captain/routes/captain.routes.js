const express = require('express');
const router = express.Router();
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', captainController.register);
router.post('/login', captainController.login);
router.post('/logout', captainController.logout);
router.get('/profile', authMiddleware.authenticate, captainController.getProfile);
router.patch('/toggle-availability', authMiddleware.authenticate, captainController.toggleAvailability);

module.exports = router;