const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')
const authMiddleware = require('../middlewares/authMiddleware')

// Route bảo vệ bằng verifyToken
router.get('/summary', authMiddleware.verifyToken, authMiddleware.requireAdmin, dashboardController.getSummary)
router.get('/weekly-chart', authMiddleware.verifyToken, authMiddleware.requireAdmin, dashboardController.weeklyChart)
router.get('/recent-booking', authMiddleware.verifyToken, authMiddleware.requireAdmin, dashboardController.recentBooking)
router.get('/finance-analysis', authMiddleware.verifyToken, authMiddleware.requireAdmin, dashboardController.financeAnalysis)
router.get('/monthly-revenue', authMiddleware.verifyToken, authMiddleware.requireAdmin, dashboardController.monthlyRevenue)
router.get('/transactions', authMiddleware.verifyToken, authMiddleware.requireAdmin, dashboardController.getTransactions)

module.exports = router
