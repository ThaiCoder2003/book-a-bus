const prisma = require('../configs/db')

const seatService = {
    getSeatById: async (id) => {
        const seat = await prisma.seat.findUnique({
            where: { id },
        })
        return seat
    },

    getSeatByTrip: async (tripId) => {
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
    },
}

module.exports = seatService
