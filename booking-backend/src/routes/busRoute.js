const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const busController = require('../controllers/busControlller');

router.get('/:id', authMiddleware.verifyToken, busController.getBusById)
router.get('/', authMiddleware.verifyToken, busController.getAllBuses)

router.post('/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.registerNewBus);

router.put('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.updateBus);
router.put('/seats/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.updateBusSeats);

router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.deleteBus);

module.exports = router;