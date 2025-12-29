const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

router.get('/getAll/:tripId', seatController.getAll);

module.exports = router;