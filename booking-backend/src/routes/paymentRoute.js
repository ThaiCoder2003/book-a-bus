const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

router.post('/payment/zalopay/:bookingId', paymentController.createPayPayment);

// ZaloPay gọi tự động (Webhook)
router.post('/payment/zalopay/callback', paymentController.zaloCallback);

module.exports = router;

