const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const bookingController = require('../controllers/bookingController');
const router = express.Router()

router.post('/create', authMiddleware.verifyToken, bookingController.create)

router.get('/getByUser/:userId', authMiddleware.verifyToken, bookingController.getByUserId)
router.get('/admin/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, bookingController.getByIdForAdmin)
router.get('/:bookingId', authMiddleware.verifyToken, bookingController.getById)
router.get('/', bookingController.getAll)

router.put('/cancel/:bookingId', authMiddleware.verifyToken, bookingController.cancel)
module.exports = router