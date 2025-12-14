const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const stationController = require('../controllers/stationController');

router.get('/getAll', authMiddleware.verifyToken, stationController.getAllStations);
router.get('/:id', authMiddleware.verifyToken, stationController.getStationById);
router.post('/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.registerNewStation);
router.post('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.updateStation);
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.deleteStation);

module.exports = router;