const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const busController = require('../controllers/busControlller');

router.get('/', authMiddleware.verifyToken, busController.getAllBuses)
router.get('/:id', authMiddleware.verifyToken, busController.getTripById)
router.post('/admin/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.registerNewBus);
router.post('/admin/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.updateBus);
router.delete('/admin/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.deleteBus);

module.exports = router;