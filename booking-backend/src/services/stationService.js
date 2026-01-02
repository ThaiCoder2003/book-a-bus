const { validateStationPayload } = require('../utils/validate')
const prisma = require('../configs/db')

const stationService = {
    getStations: async () => {
        const [stations, total] = await Promise.all([
            prisma.station.findMany(),
            prisma.station.count(),
        ])

        return {
            stations,
            stationNumber: total
        }
    },

    registerNewStation: async (data) => {
        await validateStationPayload(data, { requireAll: true })
        return prisma.station.create({ data })
    },

    updateStation: async (id, data) => {
        const exists = await prisma.station.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Station not found')
            err.statusCode = 404
            throw err
        }

        await validateStationPayload(data, {
            requireAll: false,
            existingStation: exists,
        })
        return prisma.station.update({
            where: { id },
            data,
        })
    },

    deleteStation: async (id) => {
        const exists = await prisma.station.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Station not found')
            err.statusCode = 404
            throw err
        }

        return prisma.station.delete({ where: { id } })
    },
}

module.exports = stationService
