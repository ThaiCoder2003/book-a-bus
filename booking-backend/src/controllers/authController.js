const authService = require('../services/authService')
const handleError = require('../utils/handleError')

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
