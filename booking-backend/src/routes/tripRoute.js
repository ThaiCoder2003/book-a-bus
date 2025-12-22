const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const tripController = require('../controllers/tripController')

router.get('/getAll', tripController.getAllTrips)
router.get('/:id', tripController.getTripDetail)
router.post('/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.registerNewTrip);
router.post('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.updateTrip);
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, tripController.deleteTrip);

module.exports = router
