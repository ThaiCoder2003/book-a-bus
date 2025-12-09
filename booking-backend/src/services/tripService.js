const prisma = require('../configs/db')
const { startOfDay, endOfDay } = require('date-fns')
const validatePayload = require('../utils/validate')

const tripService = {
    getAllTrips: async (departureDay, from, to, page = 1, limit = 10) => {
        const whereCondition = {}

        if (departureDay) {
            const date = new Date(departureDay)

            if (!isNaN(date)) {
                whereCondition.departureTime = {
                    gte: startOfDay(date),
                    lte: endOfDay(date),
                }
            }
        }

        if (from) {
            whereCondition.originStation = {
                province: {
                    contains: from,
                    mode: 'insensitive',
                },
            }
        }

        if (to) {
            whereCondition.destStation = {
                province: {
                    contains: to,
                    mode: 'insensitive',
                },
            }
        }

        const pageNumber = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        const skip = (pageNumber - 1) * pageSize

        try {
            const [trips, total] = await Promise.all([
                prisma.trip.findMany({
                    where: whereCondition,
                    include: {
                        originStation: true,
                        destStation: true,
                        bus: true,
                    },
                    orderBy: {
                        departureTime: 'asc',
                    },
                    skip: skip, // Bỏ qua số lượng bản ghi
                    take: pageSize, // Lấy số lượng bản ghi giới hạn
                }),
                prisma.trip.count({
                    where: whereCondition, // Đếm dựa trên cùng điều kiện lọc
                }),
            ])

            const tripsWithDuration = trips.map((trip) => {
                let hours = 0
                let minutes = 0

                if (trip.arrivalTime && trip.departureTime) {
                    // Trừ 2 mốc thời gian (kết quả ra milliseconds)
                    const diffMs =
                        new Date(trip.arrivalTime) -
                        new Date(trip.departureTime)

                    if (diffMs > 0) {
                        hours = Math.floor(diffMs / (1000 * 60 * 60))
                        minutes = Math.floor(
                            (diffMs % (1000 * 60 * 60)) / (1000 * 60),
                        )
                    }
                }

                return {
                    ...trip,
                    hoursTime: hours,
                    minutesTime: minutes,
                }
            })

            return {
                data: tripsWithDuration,
                pagination: {
                    page: pageNumber,
                    limit: pageSize,
                    totalItems: total,
                    totalPages: Math.ceil(total / pageSize),
                },
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách chuyến xe:', error)
            throw error // Ném lỗi ra để Controller bắt
        }
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

    registerNewTrip: async (data) => {
        await validatePayload.validateTripPayload(data, { requireAll: true })
        return prisma.trip.create({ data })
    },

    editTripInfo: async (id, data) => {
        const exists = await prisma.trip.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Trip not found')
            err.statusCode = 404
            throw err
        }


        await validateTripPayload(data, {
            requireAll: false,
            existingTrip: exists,
        })

        return prisma.trip.update({
            where: { id },
            data: data,
        })
    },

    deleteTrip: async (tripId) => {
        const exists = await prisma.trip.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Trip not found')
            err.statusCode = 404
            throw err
        }

        if (!exists) {
            const err = new Error('Not found: Trip not found')
            err.statusCode = 404
            throw err
        }

        return prisma.trip.delete({
            where: { id },
        })
    },
}

module.exports = tripService
