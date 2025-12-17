const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const tripController = require('../controllers/tripController')

router.get('/getAll', authMiddleware.verifyToken, tripController.getAllTrips)
router.get('/:id', authMiddleware.verifyToken, tripController.getTripById)
router.post('/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.registerNewTrip);
router.post('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.updateTrip);
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.deleteTrip);

module.exports = router
