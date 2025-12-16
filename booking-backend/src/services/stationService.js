const { validateStationPayload } = require('../utils/validate')
const prisma = require('../configs/db')

const stationService = {
    
    getStations: async(province, page = 1, limit = 10) => {
        const where = {}

        if (province) {
            where.province = province
        }

        const pageNum = parseInt(page) || 1
        const size = parseInt(limit) || 10
        const skip = (pageNum - 1) * size

        const [stations, total] = await Promise.all([
            prisma.station.findMany({
                where,
                include: {
                    arrivingTrips: true,
                    departingTrips: true,
                },
                skip,
                take: size
            }),
            prisma.station.count({
                where, // Đếm dựa trên cùng điều kiện lọc
            }),
        ])


        return {
            data: stations,
            pagination: {
                page: pageNum,
                limit: size,
                totalItems: total,
                totalPages: Math.ceil(total / size),
            },
        }
    },

    getStationById: async(id) => {
        return prisma.station.findUnique({
            where: { id },
            include: {
                arrivingTrips: true,
                departingTrips: true
            }
        })
    },

    registerNewStation: async(data) => {
        await validateStationPayload(data, { requireAll: true })
        return prisma.station.create({ data })
    }, 

    updateStation: async(id, data) => {
        const exists = await prisma.station.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Station not found')
            err.statusCode = 404
            throw err
        } 

        await validateStationPayload(data, { requireAll: false, existingStation: exists })
        return prisma.station.update({
            where: { id },
            data
        })
    },

    deleteStation: async(id) => {
        const exists = await prisma.station.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Station not found')
            err.statusCode = 404
            throw err
        } 

        return prisma.station.delete({ where: { id } })
    }
}

module.exports = stationService