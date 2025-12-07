const jwt = require('jsonwebtoken')
require('dotenv').config()

const authMiddleware = {
    verifyToken: (req, res, next) => {
        const authHeader = req.headers.authorization
        if (!authHeader)
            return res.status(401).json({ message: 'No token provided' })

        const token = authHeader.split(' ')[1] // Bearer <token>

        try {
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET || 'access_secret',
            )
            req.user = decoded // Gắn user vào request (giống Passport strategy)
            next()
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' })
        }
    },

    validate: (schema) => (req, res, next) => {
        const { error } = schema.validate(req.body)
        if (error) {
            return res.status(400).json({ message: error.details[0].message })
        }
        next()
    },

    requireAdmin: (req, res, next) => {
        if (!req.user || req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }
        next();
    }
}

module.exports = authMiddleware
