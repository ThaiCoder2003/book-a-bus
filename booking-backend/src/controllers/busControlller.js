const busService = require('../services/busService')
const handleError = require('../utils/handleError')

const busController = {
    getAllBuses: async (req, res) => {
        try {
            const { searchTerm } = req.query
            const result = await busService.getBuses(searchTerm)
            res.status(200).json({
                message: 'Get bus list successfully',
                busData: result
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getBusById: async (req, res) => {
        try {
            const { id } = req.params
            const result = await busService.getBusById(id)

            res.status(200).json(result)
        } catch (error) {
            handleError(res, error)
        }
    },

    registerNewBus: async (req, res) => {
        try {
            const newBus = await busService.registerNewBus(req.body)
            return res.status(201).json({
                message: 'Bus created successfully',
                bus: newBus,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    seatConfig: async (req, res) => {
        try {
            const { busId } = req.params
            const { seats } = req.body

            if (!busId) {
                return res.status(400).json({
                    message: 'Missing busId',
                })
            }

            if (!Array.isArray(seats) || seats.length === 0) {
                return res.status(400).json({
                    message: 'Seat layout is empty',
                })
            }

            const result = await busService.saveSeatLayout(busId, seats)

            return res.status(200).json({
                message: 'Seat layout saved successfully',
                ...result,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    updateBus: async (req, res) => {
        try {
            const { id } = req.params
            const updated = await busService.editBusInfo(id, req.body)
            return res.status(200).json({
                success: true,
                message: 'Bus updated successfully',
                bus: updated,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    deleteBus: async (req, res) => {
        try {
            const { id } = req.params
            await busService.deleteBus(id)
            return res.status(200).json({
                success: true,
                message: 'Bus deleted successfully',
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    updateBusSeats: async (req, res) => {
        try {
            const { id } = req.params
            await busService.updateBusSeats(id, req.body)
            return res.status(200).json({
                success: true,
                message: 'Seats edited successfully',
            })
        } catch (error) {
            handleError(res, error)
        }
    }
}

module.exports = busController
