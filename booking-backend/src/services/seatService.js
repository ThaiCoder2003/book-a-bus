const prisma = require('../configs/db')

const seatService = {
    getSeatById: async (id) => {
        const seat = await prisma.seat.findUnique({
            where: { id },
        })
        return seat
    },

    getSeatsByBusId: async (busId) => {
        try {
            const seats = await prisma.seat.findMany({
                where: { busId },
                orderBy: [{ floor: 'asc' }, { row: 'asc' }, { col: 'asc' }],
            })

            return seats
        } catch (error) {
            console.error(error)
            throw new Error('Lỗi xảy ra khi lấy danh sách ghế của xe.')
        }
    },

    validateAvailability: async (seatId) => {
        const seat = await prisma.seat.findUnique({
            where: { id: seatId },
        })
        if (seat.status !== 'AVAILABLE') {
            throw new Error('Seat is not available')
        }
        return true
    },
}

module.exports = seatService
