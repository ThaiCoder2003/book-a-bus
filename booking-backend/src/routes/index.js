const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoute')

router.use('/auth', authRoutes)

// health check (API kiểm tra server còn sống không)
router.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running',
        timestamp: new Date(),
    })
})

module.exports = router
