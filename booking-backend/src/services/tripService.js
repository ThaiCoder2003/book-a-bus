const prisma = require('../configs/db')
const { validateTripPayload } = require('../utils/validate')
const stationService = require('./stationService')

const tripService = {
    getAll: async(query) => {
        return await prisma.trip.findMany({
            where: query ? 
            {
                OR: [
                    { route: { name: { contains: query, mode: 'insensitive' } } },
                    { bus: { plateNumber: { contains: query, mode: 'insensitive' } } }
                ]
            }
            : undefined,

            include: {
                bus: {
                    select: {
                        name: true,
                        plateNumber: true
                    }
                },
                route: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                departureTime: 'desc' // Chuyến mới nhất hiện lên đầu cho dễ quản lý
            }
        });
    },

    getAllTrips: async (
        {
            from,
            to,
            departureDay,
            seatType = 'ALL',
            departureTime = 'all',
            sortBy = 'pickupTime_desc',
        },
        page = 1,
        limit = 10,
    ) => {
        const timeRangesMap = {
            morning: { start: 6, end: 12 },
            afternoon: { start: 12, end: 18 },
            evening: { start: 18, end: 24 },
            night: { start: 0, end: 6 },
        }

        // --- 1. VALIDATION FROM/TO ---
        // Kiểm tra logic: Có From mà không có To (hoặc ngược lại) -> Báo lỗi hoặc return rỗng tùy policy
        if ((from && !to) || (!from && to)) {
            throw new Error(
                'Vui lòng cung cấp cả điểm đi và điểm đến, hoặc để trống cả hai.',
            )
        }
        const hasLocationFilter = !!(from && to)

        // --- 2. XỬ LÝ NGÀY THÁNG (Optional) ---
        let dbQueryStart, targetDateStart, targetDateEnd

        if (departureDay) {
            targetDateStart = new Date(departureDay)
            targetDateStart.setHours(0, 0, 0, 0)

            targetDateEnd = new Date(departureDay)
            targetDateEnd.setHours(23, 59, 59, 999)

            // Buffer 3 ngày nếu lọc theo ngày (để bắt chuyến xuất phát từ hôm trước)
            dbQueryStart = new Date(targetDateStart)
            dbQueryStart.setDate(dbQueryStart.getDate() - 3)
        }

        try {
            // --- 3. TÌM STATION IDs (Nếu có filter) ---
            let startStationIds = []
            let endStationIds = []

            if (hasLocationFilter) {
                startStationIds = await stationService.findStationIdsByKeyword(
                    from,
                )
                endStationIds = await stationService.findStationIdsByKeyword(to)

                // Nếu user nhập tên bến/tỉnh không tồn tại -> Trả về rỗng luôn
                if (
                    startStationIds.length === 0 ||
                    endStationIds.length === 0
                ) {
                    return {
                        data: [],
                        meta: { total: 0, page, limit, totalPages: 0 },
                    }
                }
            }

            // --- 4. QUERY PRISMA ---
            const rawTrips = await prisma.trip.findMany({
                where: {
                    // Điều kiện ngày (Nếu không truyền departureDay -> Không lọc, lấy hết)
                    departureTime: departureDay
                        ? {
                              gte: dbQueryStart,
                              lte: targetDateEnd,
                          }
                        : undefined,

                    // Điều kiện Route (Chỉ lọc nếu có From & To)
                    route: hasLocationFilter
                        ? {
                              AND: [
                                  {
                                      route_station: {
                                          some: {
                                              stationId: {
                                                  in: startStationIds,
                                              },
                                          },
                                      },
                                  },
                                  {
                                      route_station: {
                                          some: {
                                              stationId: { in: endStationIds },
                                          },
                                      },
                                  },
                              ],
                          }
                        : undefined,

                    // Điều kiện ghế (Optional)
                    bus:
                        seatType && seatType !== 'ALL'
                            ? { seats: { some: { type: seatType } } }
                            : undefined,
                },
                include: {
                    bus: {
                        select: {
                            name: true,
                            plateNumber: true,
                            totalSeats: true,
                        },
                    },
                    route: {
                        include: {
                            route_station: {
                                where: hasLocationFilter
                                    ? {
                                          stationId: {
                                              in: [
                                                  ...startStationIds,
                                                  ...endStationIds,
                                              ],
                                          },
                                      }
                                    : undefined,
                                include: { station: true },
                            },
                        },
                    },
                },
            })

            // --- 5. XỬ LÝ LOGIC & LỌC TRÊN RAM ---
            let validTrips = rawTrips
                .map((trip) => {
                    let startNode, endNode

                    if (hasLocationFilter) {
                        // CASE A: User tìm trạm cụ thể
                        startNode = trip.route.route_station.find((rs) =>
                            startStationIds.includes(rs.stationId),
                        )
                        endNode = trip.route.route_station.find((rs) =>
                            endStationIds.includes(rs.stationId),
                        )
                    } else {
                        // CASE B: User xem toàn bộ chuyến (không filter nơi đi/đến)
                        // Logic: Lấy trạm đầu tiên (order nhỏ nhất) và trạm cuối (order lớn nhất)
                        if (
                            !trip.route.route_station ||
                            trip.route.route_station.length === 0
                        )
                            return null

                        // Sắp xếp trạm theo thứ tự
                        const sortedStations = trip.route.route_station.sort(
                            (a, b) => a.order - b.order,
                        )
                        startNode = sortedStations[0] // Điểm đầu tuyến
                        endNode = sortedStations[sortedStations.length - 1] // Điểm cuối tuyến
                    }

                    if (!startNode || !endNode) return null

                    // Check chiều đi (Quan trọng)
                    if (startNode.order >= endNode.order) return null

                    // TÍNH TOÁN GIỜ ĐÓN THỰC TẾ
                    // Nếu là điểm khởi hành gốc (durationFromStart=0), pickupTime = trip.departureTime
                    const pickupTime = new Date(
                        trip.departureTime.getTime() +
                            startNode.durationFromStart * 60 * 1000,
                    )
                    const arrivalTime = new Date(
                        trip.departureTime.getTime() +
                            endNode.durationFromStart * 60 * 1000,
                    )

                    // --- CHECK NGÀY (Nếu có filter departureDay) ---
                    if (departureDay) {
                        // Kiểm tra xem giờ đón có lọt vào đúng ngày user chọn không
                        if (
                            pickupTime < targetDateStart ||
                            pickupTime > targetDateEnd
                        ) {
                            return null
                        }
                    }

                    // --- CHECK KHUNG GIỜ (Nếu có filter departureTime) ---
                    if (departureTime && timeRangesMap[departureTime]) {
                        const range = timeRangesMap[departureTime]
                        const hour = pickupTime.getHours()
                        if (hour < range.start || hour >= range.end) {
                            return null
                        }
                    }

                    // Tính giá vé
                    const price =
                        Number(endNode.priceFromStart) -
                        Number(startNode.priceFromStart)

                    return {
                        id: trip.id,
                        busName: trip.bus.name,
                        plateNumber: trip.bus.plateNumber,
                        totalSeats: trip.bus.totalSeats, // Chỉ trả về tổng số ghế (ví dụ: 40 chỗ)
                        routeId: trip.routeId,
                        fromStation: startNode.station.name,
                        fromProvince: startNode.station.province,
                        toStation: endNode.station.name,
                        toProvince: endNode.station.province,
                        pickupTime,
                        arrivalTime,
                        duration:
                            endNode.durationFromStart -
                            startNode.durationFromStart,
                        price,
                    }
                })
                .filter((item) => item !== null) // Loại bỏ null

            // --- 6. SẮP XẾP (Optional) ---
            if (sortBy) {
                validTrips.sort((a, b) => {
                    switch (sortBy) {
                        case 'price_asc':
                            return a.price - b.price
                        case 'price_desc':
                            return b.price - a.price
                        case 'pickupTime_desc':
                            return (
                                a.pickupTime.getTime() - b.pickupTime.getTime()
                            )
                        case 'arrivalTime_desc':
                            return (
                                a.arrivalTime.getTime() -
                                b.arrivalTime.getTime()
                            )
                        default:
                            return 0
                    }
                })
            }

            // --- 7. PHÂN TRANG ---
            const total = validTrips.length
            const startIndex = (Number(page) - 1) * Number(limit)
            const paginatedData = validTrips.slice(
                startIndex,
                startIndex + Number(limit),
            )

            return {
                data: paginatedData,
                pagination: {
                    total,
                    page: Number(page),
                    limit: Number(limit),
                    totalPages: Math.ceil(total / Number(limit)),
                },
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin chuyến xe:', error)
            throw error
        }
    },

    getTripDetailById: async (tripId) => {
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                bus: true, // Lấy thông tin xe (biển số, tên xe...)
                route: {
                    include: {
                        route_station: {
                            include: { station: true },
                            orderBy: { order: 'asc' }, // Sắp xếp theo thứ tự lộ trình
                        },
                    },
                },
            },
        })

        if (!trip) throw new Error('Trip not found')

        // Map lại dữ liệu để tính giờ đến từng trạm
        const timeline = trip.route.route_station.map((rs) => {
            // Giờ đến = Giờ khởi hành gốc + thời gian di chuyển (phút)
            const estimatedTime = new Date(
                trip.departureTime.getTime() + rs.durationFromStart * 60 * 1000,
            )

            return {
                stationId: rs.stationId,
                stationName: rs.station.name,
                address: rs.station.address,
                order: rs.order,
                priceFromStart: Number(rs.priceFromStart),
                arrivalTimeISO: estimatedTime, // Frontend sẽ format giờ này
            }
        })

        return {
            tripId: trip.id,
            busName: trip.bus.name,
            plateNumber: trip.bus.plateNumber,
            totalSeats: trip.bus.totalSeats,
            routePoints: timeline, // Frontend dùng cái này để vẽ Timeline và Dropdown chọn điểm đi/đến
        }
    },

    registerNewTrip: async (payload) => {
        await validateTripPayload(payload, { requireAll: true })
        return await prisma.trip.create({
            data: {
                routeId: payload.routeId,
                busId: payload.busId,
                departureTime: payload.departureTime,
                // Nếu bạn có thêm các trường như price, status thì thêm ở đây
            }
        });
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
        const exists = await prisma.trip.findUnique({ where: { tripId } })
        if (!exists) {
            const err = new Error('Not found: Trip not found')
            err.statusCode = 404
            throw err
        }

        return prisma.trip.delete({
            where: { tripId },
        })
    },
}

module.exports = tripService
