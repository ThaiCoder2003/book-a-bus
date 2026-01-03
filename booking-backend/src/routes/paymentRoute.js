const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

router.post('/zalopay/:bookingId', authMiddleware.verifyToken, paymentController.createPayPayment);

// ZaloPay gọi tự động (Webhook)
router.post('/zalopay/callback', paymentController.callbackZaloPay);

module.exports = router;

