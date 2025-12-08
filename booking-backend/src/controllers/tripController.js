const tripService = require('../services/tripService')
const handleError = require('../utils/handleError')

const tripController = {
    getAllTrips: async (req, res) => {
        try {
            const { departureDay, from, to } = req.query
            const result = await tripService.getAllTrips(
                departureDay,
                from,
                to,
            )
            res.status(200).json({
                message: 'Get trips list successfully',
                data: result
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    registerNewTrip: async (req, res) => {
        try {
            const data = req.body
            const newTrip = await tripService.registerNewTrip(data)
            return res.status(201).json({
                message: 'Trip created successfully',
                trip: newTrip,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    updateTrip: async (req, res) => {
        try {
            const { id } = req.params
            const updated = await tripService.editTripInfo(id, req.body)
            return res.status(200).json({
                success: true,
                message: 'Trip updated successfully',
                data: updated,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    deleteTrip: async (req, res) => {
        try {
            const { id } = req.params
            await tripService.deleteTrip(id)
            return res.status(200).json({
                success: true,
                message: 'Trip deleted successfully',
            })
        } catch (error) {
            handleError(res, error)
        }
    },
}

module.exports = tripController
