const bcrypt = require('bcrypt') // hash password
const crypto = require('crypto') // hash token
const jwt = require('jsonwebtoken')
const prisma = require('../configs/db')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret'
const REFRESH_TOKEN_SECRET =
    process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'

const authAction = {
    hashPassword: async (data) => {
        return bcrypt.hash(data, 10)
    },

    hashToken: async (token) => {
        return crypto.createHash('sha256').update(token).digest('hex')
    },

    comparePassword: async (data, hash) => {
        return bcrypt.compare(data, hash)
    },

    compareToken: async (token, hashInDB) => {
        const hashedToken = await authAction.hashToken(token)
        return hashedToken === hashInDB
    },

    generateTokens: async (payload) => {
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
            expiresIn: '24h',
        })
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
            expiresIn: '7d',
        })
        return { accessToken, refreshToken, expiresIn: '24h' }
    },

    updateRefreshTokenInDB: async (userId, refreshToken) => {
        const hash = await authAction.hashToken(refreshToken)

        await prisma.user.update({
            where: { id: userId },
            data: { currentHashedRefreshToken: hash },
        })
    },
}

module.exports = authAction
