const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const stationController = require('../controllers/stationController');

router.get('/', authMiddleware.verifyToken, stationController.getAllStations);
router.get('/:id', authMiddleware.verifyToken, stationController.getStationById);
router.post('/admin/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.registerNewStation);
router.post('/admin/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.updateStation);
router.delete('/admin/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.deleteStation);

module.exports = router;