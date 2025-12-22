// src/utils/dtos.js
const Joi = require('joi')

const registerSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({ 'any.required': 'Name is required' }),
    email: Joi.string()
        .email()
        .required()
        .messages({ 'string.email': 'Invalid email format' }),
    // Validate password phức tạp như regex của bạn
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('(?=.*[a-z])'))
        .pattern(new RegExp('(?=.*[A-Z])'))
        .pattern(new RegExp('(?=.*[0-9])'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base':
                'Password must contain uppercase, lowercase and number',
        }),
    phone: Joi.string()
        .pattern(/^[0-9]+$/) // Chỉ cho phép số
        .min(10)
        .max(11)
        .required(),
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
})

module.exports = { registerSchema, loginSchema, refreshTokenSchema }
