const validatePayload = require('../utils/validate')
const prisma = require('../configs/db')

function throwError(message, statusCode) {
    const err = new Error(message)
    err.statusCode = statusCode
    throw err
}

const stationService = {
    getRoutes: async(originProvince, destProvince, code, page = 1, limit = 10) => {
        const where = {}

        if (originProvince) {
            where.originProvince = originProvince
        }

        if (destProvince) {
            where.destProvince = destProvince
        }

        if (code) {
            where.code = {
                contains: code,
                mode: 'insensitive',
            }
        }

        const pageNum = parseInt(page) || 1
        const size = parseInt(limit) || 10
        const skip = (pageNum - 1) * size

        const [routes, total] = await Promise.all([
            prisma.route.findMany({
                where,
                include: {
                    stops: true
                },
                skip,
                take: size
            }),
            prisma.route.count({
                where, // Đếm dựa trên cùng điều kiện lọc
            }),
        ])


        return {
            data: routes,
            pagination: {
                page: pageNum,
                limit: size,
                totalItems: total,
                totalPages: Math.ceil(total / size),
            },
        }
    },

    getRouteById: async(id) => {
        return prisma.route.findUnique({
            where: { id: id },
            include: {
                trips: true,
                stops: true
            }
        })
    },

    registerNewRoute: async(data) => {
        await validatePayload.validateRoutePayload(data, { requireAll: true })
        const { type, totalSeats } = data

    // 1. generate seat layout
        const seats = []

        if (type === 'SEAT') {
            for (let i = 1; i <= totalSeats; i++) {
                seats.push({
                    label: `A${i}`,
                    floor: 1,
                    row: Math.ceil(i / 4),
                    col: (i - 1) % 4 + 1,
                })
            }
        }

        if (type === 'SINGLE_BED') {
            for (let i = 1; i <= totalSeats; i++) {
                seats.push({
                    label: `B${i}`,
                    floor: i <= totalSeats / 2 ? 1 : 2,
                    row: i,
                    col: 1,
                })
            }
        }
        return prisma.route.create({ data })
    }, 

    createNewStop: async(data) => {
        const {
            routeId,
            stationId,
            order,
            arrivalTime,
            departureTime
        } = data

        if (!routeId || !stationId || order === undefined) {
            throwError('Missing required fields', 400)
        }

        // 1. check route
        const route = await prisma.route.findUnique({
            where: { id: routeId }
        })
        if (!route) {
            throwError('Route not found', 404)
        }


        // 2. Check station
        const station = await prisma.station.findUnique({
            where: { id: stationId }
        })
        if (!station) {
            throwError('Station not found', 404)
        }

        // 3. Check duplicate order
        const orderExists = await prisma.routeStop.findFirst({
            where: { routeId, order }
        })
        if (orderExists) {
            throwError('Stop order already exists', 400)
        }

            // 4. check duplicate station in same route
        const stationExists = await prisma.routeStop.findFirst({
            where: { routeId, stationId }
        })
        if (stationExists) {
            throwError('Station already exists in this route', 409)
        }

        // 5. create
        return prisma.routeStop.create({
            data: {
                routeId,
                stationId,
                order,
                arrivalTime,
                departureTime
            }
        })

    },

    updateStop: async(stopId, data) => {
        const {
            order,
            arrivalTime,
            departureTime,
            stationId
        } = data

        // 1. Check stop tồn tại
        const existingStop = await prisma.routeStop.findUnique({
            where: { id: stopId },
        })

        if (!existingStop) {
            throwError('Route stop not found', 404)
        }

        // 2. Nếu đổi station → check station tồn tại
        if (stationId) {
            const station = await prisma.station.findUnique({
                where: { id: stationId },
            })

            if (!station) {
                throwError('Station not found', 404)
            }
        }

        // 3. Nếu đổi order → check trùng trong cùng route
        if (order !== undefined) {
            const duplicatedOrder = await prisma.routeStop.findFirst({
                where: {
                    routeId: existingStop.routeId,
                    order: order,
                    NOT: { id: stopId },
                },
            })

            if (duplicatedOrder) {
                throwError('Stop order already exists in this route', 409)
            }
        }

        // 4. Update
        return prisma.routeStop.update({
            where: { id: stopId },
            data: {
                ...(order !== undefined && { order }),
                ...(arrivalTime !== undefined && { arrivalTime }),
                ...(departureTime !== undefined && { departureTime }),
                ...(stationId && { stationId }),
            },
        })
    },

    updateRoute: async(id, data) => {
        const exists = await prisma.route.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Route not found')
            err.statusCode = 404
            throw err
        } 

        await validatePayload.validateRoutePayload(data, { requireAll: false, existingRoute: exists })
        return prisma.station.update({
            where: { id },
            data
        })
    },

    deleteRoute: async(id) => {
        const exists = await prisma.route.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Route not found')
            err.statusCode = 404
            throw err
        } 

        return prisma.route.delete({ where: { id } })
    }
}

module.exports = stationService