const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.get('/profile', authMiddleware.verifyToken, userController.getUserProfile);
router.get('/stat-overview', authMiddleware.verifyToken, userController.getUserStatOverview);
router.get('/next-trip', authMiddleware.verifyToken, userController.getNextTrip);
router.get('/booking-history', authMiddleware.verifyToken, userController.getBookingHistory);
router.get('/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.getUserById);
router.get('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.getAllUsers);

router.put('/profile', authMiddleware.verifyToken, userController.editUserProfile);
router.put('/password/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.resetPassword)
router.put('/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, userController.editUserProfileAsAdmin)

module.exports = router