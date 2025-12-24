const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const paymentController = require('../controllers/paymentController');

router.post('/:id', authMiddleware.verifyToken, paymentController.createZaloPayPayment);

module.exports = router;

