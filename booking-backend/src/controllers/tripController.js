const tripService = require('../services/tripService')
const handleError = require('../utils/handleError')

const tripController = {
    getAllTrips: async (req, res) => {
        try {
            const { departureDay, from, to } = req.query
            console.log(departureDay, from, to)
            const response = await tripService.getAllTrips(
                departureDay,
                from,
                to,
            )
            res.status(200).json(response)
        } catch (error) {
            handleError(res, error)
        }
    },
}

module.exports = tripController
