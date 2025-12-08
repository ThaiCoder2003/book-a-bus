const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const busController = require('../controllers/busControlller');

router.post('/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.registerNewBus);
router.post('/update/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.updateBus);
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, busController.deleteBus);

module.exports = router;