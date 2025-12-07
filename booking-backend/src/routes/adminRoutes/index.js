const express = require('express')
const router = express.Router()

const tripAdminRoute = require('./tripAdminRoute')
const busAdminRoute = require('./busAdminRoute')

router.use('/trip', tripAdminRoute);
router.use('/bus', busAdminRoute);

module.exports = router;

