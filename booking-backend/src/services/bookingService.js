const { Prisma } = require('@prisma/client')
const prisma = require('../configs/db')

const bookingService = {
    calculateBookingPrice: async (
        tripId,
        seatIds,
        depStationId,
        arrStationId,
    ) => {
        // 1. Lấy thông tin giá vé từ Route_Station
        const routeStations = await prisma.route_Station.findMany({
            where: {
                route: {
                    trips: {
                        some: { id: tripId }, // Tìm Route thông qua Trip
                    },
                },
                stationId: { in: [depStationId, arrStationId] }, // Chỉ lấy trạm lên và xuống
            },
            select: {
                stationId: true,
                priceFromStart: true,
            },
        })

        // Tìm object trạm đi và trạm đến trong kết quả trả về
        const depRouteStation = routeStations.find(
            (rs) => rs.stationId === depStationId,
        )
        const arrRouteStation = routeStations.find(
            (rs) => rs.stationId === arrStationId,
        )

        if (!depRouteStation || !arrRouteStation) {
            throw new Error('Không tìm thấy thông tin trạm trong tuyến xe này')
        }

        // 2. Tính Base Price (Giá vé cơ bản cho 1 người/ghế thường)
        const basePrice =
            Number(arrRouteStation.priceFromStart) -
            Number(depRouteStation.priceFromStart)

        if (basePrice < 0) {
            throw new Error('Trạm đến phải nằm sau trạm đi')
        }

        // 3. Lấy thông tin các ghế đã chọn để xác định loại ghế (VIP, BED...)
        const seats = await prisma.seat.findMany({
            where: { id: { in: seatIds } },
        })

        const SEAT_MULTIPLIERS = {
            SEAT: 1,
            VIP: 1.25,
            SINGLE_BED: 1.75,
            DOUBLE_BED: 2.75,
        }

        // 4. Tính tổng tiền cuối cùng
        const finalTotalAmount = seats.reduce((total, seat) => {
            // Lấy hệ số nhân, nếu không có trong danh sách thì mặc định là 1
            const coef = SEAT_MULTIPLIERS[seat.type] || 1

            return total + basePrice * coef
        }, 0)

        return finalTotalAmount
    },

    createBooking: async (payload) => {
        const {
            userId,
            tripId,
            seatIds,
            fromOrder,
            toOrder,
            depStationId,
            arrStationId,
        } = payload

        if (seatIds.length > 5 || seatIds.length < 1) {
            throw new Error('INVALID_NUMBER_SEATS')
        }

        const finalTotalAmount = await bookingService.calculateBookingPrice(
            tripId,
            seatIds,
            depStationId,
            arrStationId,
        )

        // tạo booking
        return await prisma.$transaction(async (tx) => {
            // Tìm xem trong các ghế user chọn, có ghế nào vừa bị người khác đặt không
            const conflictingTickets = await tx.ticket.findFirst({
                where: {
                    tripId: tripId,
                    seatId: { in: seatIds }, // Chỉ check các ghế user đang chọn
                    fromOrder: { lt: toOrder },
                    toOrder: { gt: fromOrder },
                    booking: {
                        OR: [
                            { status: 'CONFIRMED' },
                            {
                                status: 'PENDING',
                                expiredAt: { gt: new Date() },
                            },
                        ],
                    },
                },
            })

            if (conflictingTickets) {
                // Nếu tìm thấy xung đột => Ném lỗi để rollback và báo FE
                throw new Error('SEAT_ALREADY_TAKEN')
            }

            // Thời gian giữ ghế (ví dụ 10 phút)
            const expiredAt = new Date(new Date().getTime() + 10 * 60 * 1000)
            console.log({
                userId,
                tripId,
                departureStationId: depStationId,
                arrivalStationId: arrStationId,
                totalAmount: finalTotalAmount,
                status: 'PENDING',
                expiredAt: expiredAt,
            })
            const newBooking = await tx.booking.create({
                data: {
                    userId,
                    tripId,
                    departureStationId: depStationId,
                    arrivalStationId: arrStationId,
                    totalAmount: finalTotalAmount,
                    status: 'PENDING',
                    expiredAt: expiredAt,
                    // Tạo luôn các vé (Tickets) liên kết
                    tickets: {
                        create: seatIds.map((seatId) => ({
                            seatId: seatId,
                            tripId: tripId, // Quan trọng để query nhanh
                            fromOrder: fromOrder,
                            toOrder: toOrder,
                        })),
                    },
                },
                include: {
                    tickets: true, // Trả về vé để hiển thị
                },
            })

            return newBooking
        })
    },

    getBookingByUser: async (userId) => {
        try {
            const bookingList = await prisma.booking.findMany({
                where: { userId },
            })

            if (bookingList) {
                return bookingList
            } else {
                throw new Error(
                    'Không thể lấy danh sách booking của người dùng.',
                )
            }
        } catch (error) {
            console.error('Lỗi khi lấy booking theo userId:', error)
            throw error
        }
    },

    toggleBooking: async (payload) => {
        const { tripId, seatId, userId } = payload

        try {
            return await prisma.$transaction(async (tx) => {
                const [trip, user] = await Promise.all([
                    tx.trip.findUniqueOrThrow({ where: { id: tripId } }),
                    tx.user.findUniqueOrThrow({ where: { id: userId } }),
                ])
                const price = trip.basePrice

                const currentBooking = await tx.booking.findFirst({
                    where: {
                        tripId,
                        userId,
                        status: 'PENDING',
                    },
                    include: { tickets: true }, // Lấy vé để check
                })

                // kiểm tra booking của chính mình
                if (!currentBooking) {
                    // Check xem ghế bị ai lấy chưa (Global check)
                    const isSeatTaken = await tx.ticket.findUnique({
                        where: { tripId_seatId: { tripId, seatId } },
                    })
                    if (isSeatTaken)
                        throw new Error('Ghế này đã có người chọn.')

                    // Tạo Booking mới với 1 vé
                    return await tx.booking.create({
                        data: {
                            userId: user.id,
                            tripId: trip.id,
                            userName: user.name,
                            userPhone: user.phone,
                            status: 'PENDING',
                            totalAmount: price, // Tổng tiền = 1 vé
                            expiredAt: new Date(Date.now() + 5 * 60 * 1000), // Hết hạn sau 5p

                            tickets: {
                                create: {
                                    tripId: trip.id,
                                    seatId: seatId,
                                    price: price,
                                    passengerName: user.name,
                                    passengerPhone: user.phone,
                                },
                            },
                        },
                        include: { tickets: true },
                    })
                } else {
                    // Check xem ghế này CÓ TRONG booking của mình không
                    const ticketInBooking = currentBooking.tickets.find(
                        (t) => t.seatId === seatId,
                    )

                    // Nếu có - trừ tiền và huỷ
                    if (ticketInBooking) {
                        await tx.ticket.delete({
                            where: { id: ticketInBooking.id },
                        })

                        const currentTotal = new Prisma.Decimal(
                            currentBooking.totalAmount,
                        )
                        const newTotal = currentTotal.sub(
                            new Prisma.Decimal(price),
                        )

                        // Nếu huỷ hết vé -> Xoá luôn Booking
                        if (currentBooking.tickets.length === 1) {
                            return await tx.booking.delete({
                                where: { id: currentBooking.id },
                            })
                        } else {
                            // Nếu còn vé -> Tính lại tiền
                            return await tx.booking.update({
                                where: { id: currentBooking.id },
                                data: {
                                    totalAmount: newTotal,
                                    // Có thể reset lại thời gian hết hạn nếu muốn user có thêm 5p
                                    expiredAt: new Date(
                                        Date.now() + 5 * 60 * 1000,
                                    ),
                                },
                                include: { tickets: true },
                            })
                        }
                    }

                    // Nếu chưa có - thêm vé và cộng tiền
                    else {
                        // Check xem ghế bị NGƯỜI KHÁC lấy chưa
                        const isTaken = await tx.ticket.findUnique({
                            where: { tripId_seatId: { tripId, seatId } },
                        })
                        if (isTaken)
                            throw new Error('Ghế này đã được người khác chọn.')

                        // Thêm vé mới nối vào booking cũ
                        await tx.ticket.create({
                            data: {
                                bookingId: currentBooking.id,
                                tripId: tripId,
                                seatId: seatId,
                                price: price,
                            },
                        })

                        // Cộng tiền
                        const currentTotal = new Prisma.Decimal(
                            currentBooking.totalAmount,
                        )
                        const newTotal = currentTotal.add(
                            new Prisma.Decimal(price),
                        )

                        return await tx.booking.update({
                            where: { id: currentBooking.id },
                            data: {
                                totalAmount: newTotal,
                                expiredAt: new Date(Date.now() + 5 * 60 * 1000), // Gia hạn thêm
                            },
                            include: { tickets: true },
                        })
                    }
                }
            })
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Chậm tay rồi! Ghế vừa bị người khác đặt mất.')
            }
            console.error('Lỗi transaction toggleBooking:', error)
            throw error
        }
    },

    updateBookingStatus: async (bookingId, newStatus) => {
        try {
            const result = await prisma.booking.updateMany({
                where: {
                    id: bookingId,
                },
                data: {
                    status: newStatus,
                },
            })

            if (result.count === 0) {
                throw new Error(
                    'Trạng thái chỗ ngồi đã thay đổi, không thể cập nhật!',
                )
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái booking:', error)
            throw error
        }
    },
}

module.exports = bookingService
