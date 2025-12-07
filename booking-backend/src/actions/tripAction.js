const prisma = require('../configs/db')

const tripAction = {
    getAllTrips: async (filters) => {
        return prisma.trip.findMany({
            where: { ...filters },
            include: {
                originStation: true,
                destStation: true,
                bus: true,
            },
        })
    },

    getTripById: async (id) => {
        return prisma.trip.findUnique({
            where: { id },
            include: {
                originStation: true,
                destStation: true,
                bus: true,
            },
        })
    },

    searchTrips: async (from, to, departureDay) => {
        const day = new Date(departureDay)
        if (isNaN(day)) throw new Error('Invalid departure date')

        const startOfDay = new Date(day)
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date(day)
        endOfDay.setHours(23, 59, 59, 999)

        return prisma.trip.findMany({
            where: {
                originStation: {
                    is: {
                        province: {
                            contains: from,
                            mode: 'insensitive',
                        },
                    },
                },
                destStation: {
                    is: {
                        province: {
                            contains: to,
                            mode: 'insensitive',
                        },
                    },
                },
                departureTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                originStation: true,
                destStation: true,
                bus: true,
            },
        })
    },

    createTrip: async (tripData) => {
        return prisma.trip.create({
            data: tripData,
        })
    },

    updateTrip: async (id, tripData) => {
        return prisma.trip.update({
            where: { id },
            data: tripData,
        })
    },

    deleteTrip: async (id) => {
        return prisma.trip.delete({
            where: { id },
        })
    },
}

module.exports = tripAction
