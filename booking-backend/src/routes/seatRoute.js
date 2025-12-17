const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const seatController = require('../controllers/seatController');

router.get('/getAll/:busId', authMiddleware.verifyToken, seatController.getAllSeat);

module.exports = router;