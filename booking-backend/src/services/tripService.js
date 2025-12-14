const prisma = require('../configs/db')
const { startOfDay, endOfDay } = require('date-fns')
const validatePayload = require('../utils/validate')

const tripService = {
    calDuration: (departureTime, arrivalTime) => {
        let hours = 0
        let minutes = 0

        // Trừ 2 mốc thời gian (kết quả ra milliseconds)
        const diffMs = new Date(arrivalTime) - new Date(departureTime)

        if (diffMs > 0) {
            hours = Math.floor(diffMs / (1000 * 60 * 60))
            minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        }

        return { hours, minutes }
    },

    getAllTrips: async (
        { from, to, departureDay, busType, departureTime, sortBy },
        page = 1,
        limit = 10,
    ) => {
        const whereCondition = {}
        const timeRangesMap = {
            morning: { start: 6, end: 12 },
            afternoon: { start: 12, end: 18 },
            evening: { start: 18, end: 24 },
            night: { start: 0, end: 6 },
        }

        if (departureDay) {
            const date = new Date(departureDay)

            if (!isNaN(date.getTime())) {
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

        if (busType && busType.length > 0) {
            const types = Array.isArray(busType) ? busType : [busType]
            whereCondition.bus = {
                type: {
                    in: types,
                },
            }
        }

        if (departureDay && departureTime && departureTime.length > 0) {
            const timeConditions = departureTime
                .map((rangeId) => {
                    const range = timeRangesMap[rangeId]

                    if (!range) return null

                    // Tạo mốc thời gian Bắt đầu
                    const startDate = new Date(departureDay)
                    startDate.setHours(range.start, 0, 0, 0)

                    // Tạo mốc thời gian Kết thúc
                    const endDate = new Date(departureDay)
                    endDate.setHours(range.end, 0, 0, 0)

                    // Trả về object điều kiện của Prisma
                    return {
                        departureTime: {
                            gte: startDate.toISOString(), // Lớn hơn hoặc bằng giờ bắt đầu
                            lt: endDate.toISOString(), // Nhỏ hơn giờ kết thúc
                        },
                    }
                })
                .filter(Boolean) // Loại bỏ các giá trị null nếu có id rác

            whereCondition.AND = [
                ...(whereCondition.AND || []), // Giữ lại các điều kiện AND cũ nếu có
                {
                    OR: timeConditions,
                },
            ]
        }

        const pageNumber = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        const skip = (pageNumber - 1) * pageSize

        let orderBy = { departureTime: 'asc' }

        switch (sortBy) {
            case 'departure-time':
                orderBy = { departureTime: 'asc' }
                break
            case 'arrival-time':
                orderBy = { arrivalTime: 'asc' }
                break
            case 'price-low': // Giá thấp nhất
                orderBy = { basePrice: 'asc' }
                break
            case 'price-high': // Giá cao nhất
                orderBy = { basePrice: 'desc' }
                break
            default:
                orderBy = { departureTime: 'asc' }
                break
        }

        try {
            const [trips, total] = await Promise.all([
                prisma.trip.findMany({
                    where: whereCondition,
                    include: {
                        originStation: true,
                        destStation: true,
                        bus: true,
                    },
                    orderBy: orderBy,
                    skip: skip, // Bỏ qua số lượng bản ghi
                    take: pageSize, // Lấy số lượng bản ghi giới hạn
                }),
                prisma.trip.count({
                    where: whereCondition, // Đếm dựa trên cùng điều kiện lọc
                }),
            ])

            const tripsWithDuration = trips.map((trip) => {
                let duration = {
                    hours: 0,
                    minutes: 0,
                }

                if (trip.arrivalTime && trip.departureTime) {
                    duration = tripService.calDuration(
                        trip.departureTime,
                        trip.arrivalTime,
                    )
                }

                return {
                    ...trip,
                    hoursTime: duration.hours,
                    minutesTime: duration.minutes,
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
        try {
            const trip = await prisma.trip.findUnique({
                where: { id },
                include: {
                    originStation: true,
                    destStation: true,
                    bus: true,
                },
            })

            let duration = {
                hours: 0,
                minutes: 0,
            }

            duration = tripService.calDuration(
                trip.departureTime,
                trip.arrivalTime,
            )

            return {
                ...trip,
                hoursTime: duration.hours,
                minutesTime: duration.minutes,
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin chuyến xe:', error)
            throw error
        }
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
