const express = require('express');
const router = express.Router();

const { registerNewTrip, updateTrip, deleteTrip } = require('../../controllers/adminControllers/tripAdminController');
const auth = require('../../middlewares/authMiddleware');

// Only admins are allowed
router.use(auth.verifyToken, auth.requireAdmin);

// Create new trip
router.post('/', registerNewTrip);

// Update trip
router.put('/:id', updateTrip);

// Delete trip
router.delete('/:id', deleteTrip);

module.exports = router;