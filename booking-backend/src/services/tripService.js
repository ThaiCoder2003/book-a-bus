const prisma = require('../configs/db')
const { startOfDay, endOfDay } = require('date-fns')

const tripService = {
    getAllTrips: async (filters) => {
        return tripAction.getAllTrips(filters)
    },

    getTripById: async (id) => {
        return tripAction.getTripById(id)
    },
}

module.exports = tripService
