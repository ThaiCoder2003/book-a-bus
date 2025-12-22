const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const seatController = require('../controllers/seatController');

// router.get('/getAll/:tripId', authMiddleware.verifyToken, seatController.getSeatByTrip);

module.exports = router;