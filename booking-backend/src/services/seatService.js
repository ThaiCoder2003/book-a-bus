const prisma = require('../configs/db')

const seatService = {
    getSeatById: async (id) => {
        const seat = await prisma.seat.findUnique({
            where: { id },
        })
        return seat
    },

    getTripSeats: async ({tripId, fromOrder, toOrder}) => {
        // 1. Lấy thông tin chuyến đi để biết busId
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            select: { busId: true },
        })

        if (!trip) throw new Error('Trip not found')

        // 2. Lấy danh sách TẤT CẢ các ghế của xe đó
        const allSeats = await prisma.seat.findMany({
            where: { busId: trip.busId },
            orderBy: { label: 'asc' }, // Sắp xếp theo tên ghế
        })

        // 3. Tìm các vé ĐANG chiễm chỗ trong khoảng fromOrder -> toOrder
        // Lưu ý: Chỉ lấy vé CONFIRMED hoặc PENDING (chưa hết hạn)
        const occupiedTickets = await prisma.ticket.findMany({
            where: {
                tripId: tripId,
                // Logic Overlap: Vé tồn tại giao nhau với khoảng người dùng chọn
                fromOrder: { lt: toOrder },
                toOrder: { gt: fromOrder },
                // Kiểm tra trạng thái Booking
                booking: {
                    OR: [
                        { status: 'CONFIRMED' },
                        {
                            status: 'PENDING',
                            expiredAt: { gt: new Date() }, // Chỉ tính PENDING nếu chưa hết hạn
                        },
                    ],
                },
            },
            select: { seatId: true }, // Chỉ cần lấy ID ghế
        })

        // Tạo Set seatId để tra cứu cho nhanh (O(1))
        const occupiedSeatIds = new Set(occupiedTickets.map((t) => t.seatId))

        // 4. Map dữ liệu trả về frontend
        const result = allSeats.map((seat) => ({
            ...seat,
            isAvailable: !occupiedSeatIds.has(seat.id), // True nếu không nằm trong danh sách bận
        }))

        return result
    },

    saveSeatLayout: async (busId, seats) => {
        return prisma.$transaction(async (tx) => {
            // 1. Check bus tồn tại
            const bus = await tx.bus.findUnique({ where: { id: busId } })
            if (!bus) throwError('Bus not found', 404)

            // 2. Update hàng loạt
            const updates = seats.map((seat) =>
                tx.seat.update({
                    where: { id: seat.id },
                    data: {
                        ...(seat.type && { type: seat.type }),
                        ...(seat.row !== undefined && { row: seat.row }),
                        ...(seat.col !== undefined && { col: seat.col }),
                        ...(seat.floor !== undefined && { floor: seat.floor }),
                        ...(seat.isActive !== undefined && {
                            isActive: seat.isActive,
                        }),
                    },
                }),
            )

            await Promise.all(updates)

            // 3. Recalculate totalSeats
            const totalSeats = await tx.seat.count({
                where: { busId },
            })

            await tx.bus.update({
                where: { id: busId },
                data: { totalSeats },
            })

            return { success: true }
        })
    },

    checkSeatOverlap: async (tripId, seatId, fromOrder, toOrder) => {
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
                    ],
                },
            },
        })

        return !!conflict
    },
}

module.exports = seatService
