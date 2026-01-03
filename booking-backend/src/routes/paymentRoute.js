const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

const jsonParser = express.json();

// ZaloPay gọi tự động (Webhook)
router.post('/zalopay/callback', jsonParser, paymentController.callbackZaloPay);
router.post('/zalopay/:bookingId', authMiddleware.verifyToken, paymentController.createPayPayment);


module.exports = router;

