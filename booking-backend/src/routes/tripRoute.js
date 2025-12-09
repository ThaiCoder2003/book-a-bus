const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const tripController = require('../controllers/tripController')

// Route bảo vệ bằng verifyToken
router.get('/', authMiddleware.verifyToken, tripController.getAllTrips)
router.get('/:id', authMiddleware.verifyToken, tripController.getTripById)
router.post('/admin/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.registerNewTrip);
router.post('/admin/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.updateTrip);
router.delete('/admin/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.deleteTrip);

module.exports = router
