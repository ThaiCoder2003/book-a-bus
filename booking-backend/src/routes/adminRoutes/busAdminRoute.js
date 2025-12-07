const express = require('express');
const router = express.Router();

const { registerNewBus, updateBus, deleteBus } = require('../../controllers/adminControllers/busAdminControlller')
const auth = require('../../middlewares/authMiddleware');

// Only admins are allowed
router.use(auth.verifyToken, auth.requireAdmin);

// Create new trip
router.post('/', registerNewBus);

// Update trip
router.put('/:id', updateBus);

// Delete trip
router.delete('/:id', deleteBus);

module.exports = router;