const prisma = require('../configs/db')

const busAction = {
    getBuses: async(filters) => {
    const { name, ...rest } = filters;
    return prisma.bus.findMany({
        where: {
            ...rest,
            ...(name && {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            })
        },
        include
    });
    },

    getBusById: async(busId) => {
        return prisma.bus.findUnique({
            where: { id: busId },
            include
        })
    },

    registerNewBus: async(busData) => {
        return prisma.bus.create({
            data: busData,
        })
    },

    updateBus: async(busId, busData) => {
        return prisma.bus.update({
            where: { id: busId },
            data: busData
        })
    },

    deleteBus: async(busId) => {
        return prisma.bus.delete({
            where: { id: busId }
        })
    }
}

module.exports = busAction