const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

const {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
} = require('../utils/dtos')

// Định nghĩa route + gắn middleware validate + gắn controller
router.post('/register', authMiddleware.validate(registerSchema), authController.register)
router.post('/login', authMiddleware.validate(loginSchema), authController.login)
router.post(
    '/refresh',
    authMiddleware.validate(refreshTokenSchema),
    authController.refreshToken,
)

// Route bảo vệ bằng verifyToken
router.get('/profile', authMiddleware.verifyToken, authController.getProfile)

module.exports = router
