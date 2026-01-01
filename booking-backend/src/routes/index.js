const express = require('express')
const router = express.Router()

const authRoutes = require('./authRoute')
const tripRoutes = require('./tripRoute')
const routeRoutes = require('./routeRoute')
const busRoutes = require('./busRoute')
const stationRoutes = require('./stationRoute')
const seatRoutes = require('./seatRoute')
const dashboardRoutes = require('./dashboardRoute')
const paymentRoutes = require('./paymentRoute')
const bookingRoutes = require('./bookingRoute')

router.use('/auth', authRoutes)
router.use('/trips', tripRoutes)
router.use('/routes', routeRoutes)
router.use('/bus', busRoutes)
router.use('/station', stationRoutes)
router.use('/seats', seatRoutes)
router.use('/adminDashboard', dashboardRoutes)
router.use('/payment', paymentRoutes)
router.use('/bookings', bookingRoutes)

// health check (API kiểm tra server còn sống không)
router.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Server is running',
        timestamp: new Date(),
    })
})

module.exports = router
