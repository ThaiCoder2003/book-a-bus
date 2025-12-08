const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoute')
const tripRoutes = require('./tripRoute')
const busRoutes = require('./busRoute')

router.use('/auth', authRoutes)
router.use('/trips', tripRoutes)
router.use('/bus', busRoutes)

// health check (API kiểm tra server còn sống không)
router.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running',
        timestamp: new Date(),
    })
})

module.exports = router
