const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const tripController = require('../controllers/tripController')

// Route bảo vệ bằng verifyToken
router.get('/getAll', authMiddleware.verifyToken, tripController.getAllTrips)

module.exports = router
