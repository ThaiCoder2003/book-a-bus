const validatePayload = require('../utils/validate')
const prisma = require('../configs/db')
const { Prisma } =require('@prisma/client')

const busService = {
    getBuses: async (type, page = 1, limit = 10) => {
        const whereCondition = {}

        if (type) {
            whereCondition.type = type
        }

        const pageNumber = parseInt(page) || 1
        const pageSize = parseInt(limit) || 10
        const skip = (pageNumber - 1) * pageSize

        const [buses, total] = await Promise.all([
            prisma.bus.findMany({
                where,
                include: {
                    seats: true,
                    trips: true
                },
                skip,
                take: pageSize
            }),
            prisma.trip.count({
                where, // Đếm dựa trên cùng điều kiện lọc
            }),
        ])

        return {
            data: buses,
            pagination: {
                page: pageNumber,
                limit: pageSize,
                totalItems: total,
                totalPages: Math.ceil(total / pageSize),
            },
        }
    },

    getBusById: async (busId) => {
        return prisma.bus.findUnique({
            where: { id: busId },
            include: {
                seats: true
            },
        })
    },

    registerNewBus: async (data) => {
        await validatePayload.validateBusPayload(data, { requireAll: true })

        const { type, totalSeats } = data
        return prisma.$transaction(async (tx) => {
    // 1️⃣ Create Bus
            const bus = await tx.bus.create({
                data,
            })

    // 2️⃣ Generate Seats
            const seats = []
        // 1. generate seat layout

            if (type === 'SEAT') {
                for (let i = 1; i <= totalSeats; i++) {
                    seats.push({
                        label: `A${i}`,
                        floor: 1,
                        row: Math.ceil(i / 4),
                        col: (i - 1) % 4 + 1,
                        type: 'SEAT'
                    })
                }
            }

            if (type === 'BED') {
                const half = totalSeats / 2

                for (let i = 1; i <= totalSeats; i++) {
                    const isLower = i <= half
                    const index = isLower ? i : i - half

                    seats.push({
                    label: `B${i}`,
                    floor: isLower ? 1 : 2,
                    row: Math.ceil(index / 2),
                    col: index % 2 === 0 ? 2 : 1,
                    type: 'SINGLE_BED',
                    busId: bus.id,
                    })
                }
            }
            
            const seatsWithBusId = seats.map(seat => ({
                ...seat,
                busId: bus.id,
            }))

            await tx.seat.createMany({
                data: seatsWithBusId,
            })

            return bus
        })
    },

    editBusInfo: async (id, data) => {
        const exists = await prisma.bus.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Bus not found')
            err.statusCode = 404
            throw err
        }

        await validatePayload.validateBusPayload(data, {
            requireAll: false,
            existingTrip: exists,
        })

        return prisma.bus.update({
            where: { id: busId },
            data
        })
    },

    deleteBus: async (id) => {
        const exists = await prisma.bus.findUnique({ where: { id } })
        if (!exists) {
            const err = new Error('Not found: Bus not found')
            err.statusCode = 404
            throw err
        }

        return prisma.bus.delete({
            where: { id },
        })
    },
}

module.exports = busService
