const validatePayload = require('../utils/validate')
const prisma = require('../configs/db')

const busService = {
    getBuses: async (type, page = 1, limit = 10) => {
        const whereCondition = {}

        if (type) {
            whereCondition.type = type
        }

        const pageNumber = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        const skip = (pageNumber - 1) * pageSize

        const [stations, total] = await Promise.all([
            prisma.bus.findMany({
                where,
                include: {
                    seats: true
                },
                skip,
                take
            }),
            prisma.trip.count({
                where, // Đếm dựa trên cùng điều kiện lọc
            }),
        ])

        return {
            data: stations,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
            },
        }
    },

    getBusById: async (busId) => {
        return prisma.bus.findUnique({
            where: { id: busId },
            include: {
                seats: true
            },
        })
    },

    registerNewBus: async (data) => {
        await validatePayload.validateBusPayload(data, { requireAll: true })
        return prisma.bus.create({ data })
    },

    editBusInfo: async (id, data) => {
        const exists = await prisma.bus.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Bus not found')
            err.statusCode = 404
            throw err
        }

        await validatePayload.validateBusPayload(data, {
            requireAll: false,
            existingTrip: exists,
        })

        return prisma.bus.update({
            where: { id: busId },
            data
        })
    },

    deleteBus: async (id) => {
        const exists = await prisma.bus.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Bus not found')
            err.statusCode = 404
            throw err
        }

        return prisma.bus.delete({
            where: { id },
        })
    },
}

module.exports = busService
