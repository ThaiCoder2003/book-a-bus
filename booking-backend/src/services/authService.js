// src/services/auth.service.js
const prisma = require('../configs/db')
const jwt = require('jsonwebtoken')
const authAction = require('../actions/authAction')
require('dotenv').config()

const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'

const authService = {
    registerUser: async ({ email, password, name, phone }) => {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) throw new Error('Conflict: Email already in use')

        const passwordHash = await authAction.hashPassword(password)

        const newUser = await prisma.user.create({
            data: { email, passwordHash, name, role: 'USER', phone },
        })

        const { passwordHash: _, ...result } = newUser
        return result
    },

    loginUser: async ({ email, password }) => {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) throw new Error('Unauthorized: Invalid email or password')

        const isPasswordValid = await authAction.comparePassword(
            password,
            user.passwordHash,
        )
        if (!isPasswordValid)
            throw new Error('Unauthorized: Invalid email or password')

        const payload = {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }

        const tokens = await authAction.generateTokens(payload)
        await authAction.updateRefreshTokenInDB(user.id, tokens.refreshToken)

        const { passwordHash: _, ...userWithoutHash } = user
        return { user: userWithoutHash, token: tokens }
    },

    refreshToken: async (token) => {
        try {
            const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET)
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            })

            if (!user || !user.currentHashedRefreshToken)
                throw new Error('Forbidden: Access Denied')

            const isMatching = await authAction.compareToken(
                token,
                user.currentHashedRefreshToken,
            )
            if (!isMatching) throw new Error('Forbidden: Invalid Refresh Token')

            const payload = {
                userId: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }

            const newTokens = await authAction.generateTokens(payload)

            await authAction.updateRefreshTokenInDB(
                user.id,
                newTokens.refreshToken,
            )

            return newTokens
        } catch (error) {
            if (error.message.includes('Forbidden')) throw error
            throw new Error('Unauthorized: Invalid or expired token')
        }
    },
}

module.exports = authService
