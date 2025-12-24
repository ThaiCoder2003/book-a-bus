const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')
const authMiddleware = require('../middlewares/authMiddleware')

// Route bảo vệ bằng verifyToken
router.get('/summary', authMiddleware.verifyToken, dashboardController.getSummary)
router.get('/yearly-revenue', authMiddleware.verifyToken, dashboardController.yearlyRevenue)

module.exports = router
