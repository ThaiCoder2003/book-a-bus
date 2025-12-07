const prisma = require('../configs/db')

const seatService = {
    getSeatById: async (id) => {
        const seat = await prisma.seat.findUnique({
            where: { id },
        })
        return seat
    },

    getSeatsByBus: async (busId) => {
        const seats = await prisma.seat.findMany({
            where: { busId },
        })
        return seats
    },

    lockSeat: async (seatId, userId) => {
        const seat = await prisma.seat.findUnique({
            where: { id: seatId },
        })

        if (!seat) {
            throw new Error('Seat not found')
        }

        const lockedSeat = await prisma.seatLock.create({
            data: {
                seatId: seatId,
                userId: userId,
                lockedAt: new Date(),
            },
        })
        return lockedSeat
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