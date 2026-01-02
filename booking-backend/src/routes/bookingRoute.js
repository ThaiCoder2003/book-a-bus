const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/bookingController');
const router = express.Router()

router.post('/create', authMiddleware.verifyToken, bookingController.create)
router.get('/getByUser/:userId', authMiddleware.verifyToken, bookingController.getByUserId)
router.get('/:bookingId', authMiddleware.verifyToken, bookingController.getById)
module.exports = router