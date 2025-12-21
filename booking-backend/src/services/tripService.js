const prisma = require('../configs/db')
const { startOfDay, endOfDay } = require('date-fns')
const { validateTripPayload } = require('../utils/validate')

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

        // lọc ngày xuất phát
        if (departureDay) {
            const date = new Date(departureDay)

            if (!isNaN(date.getTime())) {
                whereCondition.departureTime = {
                    gte: startOfDay(date),
                    lte: endOfDay(date),
                }
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

        const routeConditions = []

        if (from) {
            routeConditions.push({
                stops: {
                    some: {
                        station: {
                            province: { contains: from, mode: 'insensitive' },
                        },
                    },
                },
            })
        }

        if (to) {
            routeConditions.push({
                stops: {
                    some: {
                        station: {
                            province: { contains: to, mode: 'insensitive' },
                        },
                    },
                },
            })
        }

        if (routeConditions.length > 0) {
            whereCondition.route = {
                AND: routeConditions,
            }
        }

        const rawTrips = await prisma.trip.findMany({
            where: whereCondition,
            include: {
                bus: true,
                route: {
                    include: {
                        stops: {
                            include: { station: true },
                            orderBy: { order: 'asc' }, // Lấy stops theo thứ tự để dễ xử lý
                        },
                    },
                },
                // Lấy vé để tính ghế trống
                tickets: {
                    select: { seatId: true, fromOrder: true, toOrder: true },
                },
            },
        })

        // 3. Xử lý Logic Nghiệp vụ (Mapping & Calculation)
        let processedTrips = rawTrips
            .map((trip) => {
                // Tìm trạm đi và trạm đến cụ thể trong list stops của trip này
                // (Logic tìm kiếm mờ - fuzzy search dựa trên province)
                const startStop = from
                    ? trip.route.stops.find((s) =>
                          s.station.province
                              .toLowerCase()
                              .includes(from.toLowerCase()),
                      )
                    : trip.route.stops[0] // Mặc định trạm đầu nếu không search

                const endStop = to
                    ? trip.route.stops.find((s) =>
                          s.station.province
                              .toLowerCase()
                              .includes(to.toLowerCase()),
                      )
                    : trip.route.stops[trip.route.stops.length - 1] // Mặc định trạm cuối

                // Bỏ qua nếu không tìm thấy trạm hoặc đi ngược chiều (order đi >= order đến)
                if (
                    !startStop ||
                    !endStop ||
                    startStop.order >= endStop.order
                ) {
                    return null
                }

                // --- TÍNH TOÁN THỜI GIAN ---
                // Trip.departureTime là giờ xe chạy tại trạm gốc (order 0)
                // Giờ đón khách = Giờ gốc + durationFromStart
                const pickupTime = new Date(
                    trip.departureTime.getTime() +
                        startStop.durationFromStart * 60000,
                )
                const dropOffTime = new Date(
                    trip.departureTime.getTime() +
                        endStop.durationFromStart * 60000,
                )

                // Tính thời gian di chuyển
                const duration = calDuration(pickupTime, dropOffTime)

                // --- TÍNH GIÁ VÉ ---
                // Giá = Giá tại trạm đến - Giá tại trạm đi
                const price =
                    Number(endStop.priceFromStart) -
                    Number(startStop.priceFromStart)

                // --- TÍNH GHẾ TRỐNG (OVERLAP LOGIC) ---
                const occupiedSeats = new Set()
                trip.tickets.forEach((ticket) => {
                    // Check trùng: (Vé.from < Khách.to) AND (Vé.to > Khách.from)
                    if (
                        ticket.fromOrder < endStop.order &&
                        ticket.toOrder > startStop.order
                    ) {
                        occupiedSeats.add(ticket.seatId)
                    }
                })
                const availableSeats = trip.bus.totalSeats - occupiedSeats.size

                return {
                    id: trip.id,
                    busName: trip.bus.name,
                    plateNumber: trip.bus.plateNumber,
                    totalSeats: trip.bus.totalSeats,
                    availableSeats,

                    // Thông tin trạm
                    originStation: startStop.station,
                    destStation: endStop.station,

                    // Thông tin tính toán
                    departureTime: pickupTime, // Giờ đón thực tế
                    arrivalTime: dropOffTime, // Giờ đến thực tế
                    durationHours: duration.hours,
                    durationMinutes: duration.minutes,
                    price: price,
                }
            })
            .filter((item) => item !== null) // Lọc bỏ các item null

        // 4. Lọc theo khung giờ (departureTime filter)
        // Logic cũ của bạn lọc theo giờ gốc chuyến xe, nhưng logic mới nên lọc theo GIỜ ĐÓN KHÁCH (pickupTime)
        if (departureTime && departureTime.length > 0) {
            const timeRangesMap = {
                morning: { start: 6, end: 12 },
                afternoon: { start: 12, end: 18 },
                evening: { start: 18, end: 24 },
                night: { start: 0, end: 6 },
            }

            processedTrips = processedTrips.filter((trip) => {
                const hour = trip.departureTime.getHours()
                return departureTime.some((rangeKey) => {
                    const range = timeRangesMap[rangeKey]
                    return range && hour >= range.start && hour < range.end
                })
            })
        }

        // 5. Sắp xếp (Sorting) - Thực hiện trên Array JS
        if (sortBy) {
            processedTrips.sort((a, b) => {
                switch (sortBy) {
                    case 'price-low':
                        return a.price - b.price
                    case 'price-high':
                        return b.price - a.price
                    case 'time-early':
                        return (
                            a.departureTime.getTime() -
                            b.departureTime.getTime()
                        )
                    case 'time-late':
                        return (
                            b.departureTime.getTime() -
                            a.departureTime.getTime()
                        )
                    default:
                        return 0
                }
            })
        } else {
            // Mặc định sort theo giờ đi sớm nhất
            processedTrips.sort(
                (a, b) => a.departureTime.getTime() - b.departureTime.getTime(),
            )
        }

        // 6. Phân trang (Pagination) - Cắt Array thủ công
        const totalItems = processedTrips.length
        const totalPages = Math.ceil(totalItems / limit)
        const startIndex = (page - 1) * limit
        const paginatedData = processedTrips.slice(
            startIndex,
            startIndex + limit,
        )

        return {
            data: paginatedData,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalItems,
                totalPages,
            },
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
        await validateTripPayload(data, { requireAll: true })
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
