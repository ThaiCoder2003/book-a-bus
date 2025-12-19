const prisma = require('../configs/db')

const seatService = {
    getSeatById: async (id) => {
        const seat = await prisma.seat.findUnique({
            where: { id },
        })
        return seat
    },

    getSeatByTrip: async (tripId) => {
        try {
        const seats = await prisma.seat.findMany({
            // lấy tất cả ghế của xe chạy chuyến này
            where: {
                bus: { trips: { some: { id: tripId } } },
            },
            orderBy: [{ floor: 'asc' }, { row: 'asc' }, { col: 'asc' }],
            // kèm theo thông tin Vé (Ticket)
            include: {
                tickets: {
                    where: {
                        tripId: tripId, // Chỉ xét vé của chuyến này
                        booking: {
                            // 3. Quan trọng: Lấy cả PENDING (đang giữ) và CONFIRMED (đã bán)
                            status: {
                                in: ['PENDING', 'CONFIRMED'],
                            },
                        },
                    },
                },
            },
        })

            return seats
        } catch (error) {
            console.error(error)
            throw new Error('Lỗi xảy ra khi lấy danh sách ghế của xe.')
        }
    },

    saveSeatLayout: async (busId, seats) => {
        return prisma.$transaction(async (tx) => {

            // 1. Check bus tồn tại
            const bus = await tx.bus.findUnique({ where: { id: busId } })
            if (!bus) throwError('Bus not found', 404)

            // 2. Update hàng loạt
            const updates = seats.map(seat =>
                tx.seat.update({
                    where: { id: seat.id },
                    data: {
                    ...(seat.type && { type: seat.type }),
                    ...(seat.row !== undefined && { row: seat.row }),
                    ...(seat.col !== undefined && { col: seat.col }),
                    ...(seat.floor !== undefined && { floor: seat.floor }),
                    ...(seat.isActive !== undefined && { isActive: seat.isActive }),
                    }
                })
            )

            await Promise.all(updates)

            // 3. Recalculate totalSeats
            const totalSeats = await tx.seat.count({
                where: { busId }
            })

            await tx.bus.update({
                where: { id: busId },
                data: { totalSeats }
            })

            return { success: true }
        })
    },

    checkSeatOverlap: async(tripId, seatId, fromOrder, toOrder) => {
        if (fromOrder >= toOrder) {
            throw new Error('Invalid stop range')
        }

        const conflict = await prisma.ticket.findFirst({
            where: {
                tripId,
                seatId,
                NOT: {
                    OR: [
                        { toOrder: { lte: fromOrder } },
                        { fromOrder: { gte: toOrder } },
                    ]
                }
            }
        })

        return !!conflict
    }
}

module.exports = seatService
