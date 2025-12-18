const validatePayload = require('../utils/validate')
const prisma = require('../configs/db')

function throwError(message, statusCode) {
    const err = new Error(message)
    err.statusCode = statusCode
    throw err
}

const routeService = {
    findAllRoutes: async () => {
        return prisma.route.findMany({
            include: {
                // dem so stop trong route
                _count: { select: { stops: true, trips: true } },
            },
        })
    },
    
    findRoutesByStations: async (fromStationId, toStationId) => {
        const routes = await prisma.route.findMany({
            where: {
                stops: {
                    some: { stationId: fromStationId },
                },
                AND: {
                    stops: {
                        some: { stationId: toStationId },
                    },
                },
            },
            include: {
                // dem so stop trong route
                _count: { select: { stops: true, trips: true } },
                stops: true
            },
        })

        return routes.filter(route => {
            const from = route.stops.find(s => s.stationId === fromStationId)
            const to = route.stops.find(s => s.stationId === toStationId)
            return from && to && from.order < to.order
        })
    },


    getRouteById: async(id) => {
        const route = await prisma.route.findUnique({
            where: { id: id },
            include: {
                trips: true,
                stops: {
                    orderBy: { order: 'asc' },
                    include: { station: true },
                },
            }
        })
        if (!route) throwError('Route not found', 404)
        return route
    },

    registerNewRoute: async(data) => {
        await validatePayload.validateRoutePayload(data, { requireAll: true })
        return prisma.route.create({ data })
    }, 

    createNewStop: async(data) => {
        const {
            routeId,
            stationId,
            order,
            durationFromStart,
            distanceFromStart,
            price
        } = data

        if (!routeId || !stationId || order === undefined) {
            throwError('Missing required fields', 400)
        }
        // 1. check route
        const route = await prisma.route.findUnique({ where: { id: routeId } })
        if (!route) { throwError('Route not found', 404) }

        // 2. Check station
        const station = await prisma.station.findUnique({ where: { id: stationId } })
        if (!station) {
            throwError('Station not found', 404)

        }
            // 4. check duplicate station in same route
        const stationExists = await prisma.routeStop.findFirst({
            where: { routeId, stationId }
        })
        if (stationExists) {
            throwError('Station already exists in this route', 409)
        }

        if (order < 1) {
            throwError('Order must be >= 1', 400)
        }

        // 5. If orer is 1, durationFromStart and distanceFromStart must be 0
        if (order === 1) {
            if ((durationFromStart && durationFromStart !== 0) || (distanceFromStart && distanceFromStart !== 0) || (price && price !== 0)) {
                throwError('For the first stop, durationFromStart, distanceFromStart and price must be 0', 400)
            }
        }
        return prisma.$transaction(async (tx) => {
        // 6. Before creating, move all the orders >= this order up by 1
            await tx.routeStop.updateMany({
                where: {
                    routeId,
                    order: { gte: order }
                },
                data: {
                    order: { increment: 1 }
                }
            })  

            return tx.routeStop.create({
                data: {
                    routeId,
                    stationId,
                    order,
                    durationFromStart: durationFromStart ?? 0,
                    distanceFromStart: distanceFromStart ?? 0,
                    price: price ?? 0
                }
            })
        })
    },

    updateStop: async(stopId, data) => {
        const {
            order,
            arrivalTime,
            departureTime,
            stationId
        } = data

        // 2. Nếu đổi station → check station tồn tại

        if (order && order == 0) {
            throwError('Order must be >= 1', 400)
        }

        // 4. Update
        return prisma.$transaction(async (tx) => {
            
            const existing = await tx.routeStop.findUnique({ where: { id: stopId } })

            if (!existing) {
                throwError('Stop not found', 404)
            }

            const routeId = existing.routeId
            const oldOrder = existing.order

            if (stationId) {
                const station = await tx.station.findUnique({
                    where: { id: stationId },
                })

                if (!station) {
                    throwError('Station not found', 404)
                }
            }

            // Handle reorder
            if (order !== undefined && order !== oldOrder) {
                if (order > oldOrder) {
                    // Kéo các stop ở giữa xuống
                    await tx.routeStop.updateMany({
                        where: {
                            routeId,
                            order: { gt: oldOrder, lte: order }
                        },
                        data: {
                            order: { decrement: 1 }
                        }
                    })
                } else {
                    // Đẩy các stop ở giữa lên
                    await tx.routeStop.updateMany({
                        where: {
                            routeId,
                            order: { gte: order, lt: oldOrder }
                        },
                        data: {
                            order: { increment: 1 }
                        }
                    })
                }
            }

            return tx.routeStop.update({
                where: { id: stopId },
                data: { ...data }
            })
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
        return prisma.route.update({
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

module.exports = routeService