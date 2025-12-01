const authService = require('../services/authService')

// Helper xử lý lỗi (Private function trong module, không cần export)
const handleError = (res, error) => {
    if (error.message.startsWith('Conflict'))
        return res.status(409).json({ message: error.message })
    if (error.message.startsWith('Unauthorized'))
        return res.status(401).json({ message: error.message })
    if (error.message.startsWith('Forbidden'))
        return res.status(403).json({ message: error.message })
    return res.status(500).json({ message: 'Internal Server Error' })
}

const authController = {
    register: async (req, res) => {
        try {
            const result = await authService.registerUser(req.body)
            res.status(201).json(result)
        } catch (error) {
            handleError(res, error)
        }
    },

    login: async (req, res) => {
        try {
            const result = await authService.loginUser(req.body)
            res.status(200).json(result)
        } catch (error) {
            handleError(res, error)
        }
    },

    refreshToken: async (req, res) => {
        try {
            const result = await authService.refreshToken(req.body.refreshToken)
            res.status(200).json(result)
        } catch (error) {
            handleError(res, error)
        }
    },

    getProfile: async (req, res) => {
        res.status(200).json({
            message: 'This is a protected route',
            user: req.user,
        })
    },
}

module.exports = authController
