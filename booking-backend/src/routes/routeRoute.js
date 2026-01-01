const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const routeController = require('../controllers/routeController');

router.get('/', authMiddleware.verifyToken, routeController.getRoutes)
router.get('/:id', authMiddleware.verifyToken, routeController.getRouteById)

router.post('/register', authMiddleware.verifyToken, authMiddleware.requireAdmin, routeController.registerNewRoute);
router.delete('/delete/:id', authMiddleware.verifyToken, authMiddleware.requireAdmin, routeController.deleteRoute);

module.exports = router