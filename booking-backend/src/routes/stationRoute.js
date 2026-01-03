const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const stationController = require('../controllers/stationController');

router.put('/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.updateStation);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.deleteStation);
router.get('/', authMiddleware.verifyToken, stationController.getAllStations);
router.post('/', authMiddleware.verifyToken, authMiddleware.requireAdmin, stationController.registerNewStation);

module.exports = router;