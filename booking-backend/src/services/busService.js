const validatePayload = require('../utils/validate')
const prisma = require('../configs/db')

const busService = {
    getBuses: async (filters) => {
        const { name, ...rest } = filters
        return prisma.bus.findMany({
            where: {
                ...rest,
                ...(name && {
                    name: {
                        contains: name,
                        mode: 'insensitive',
                    },
                }),
            },
            include,
        })
    },

    getBusById: async (busId) => {
        return prisma.bus.findUnique({
            where: { id: busId },
            include,
        })
    },

    registerNewBus: async (data) => {
        await validatePayload.validateBusPayload(data, { requireAll: true })
        return prisma.bus.create({
            data: busData,
        })
    },

    editBusInfo: async (id, data) => {
        const exists = await busAction.getBusById(id)
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
            data: busData,
        })
    },

    deleteBus: async (tripId) => {
        const exists = await busAction.getBusById(tripId)
        if (!exists) {
            const err = new Error('Not found: Bus not found')
            err.statusCode = 404
            throw err
        }

        return prisma.bus.delete({
            where: { id: busId },
        })
    },
}

module.exports = busService
