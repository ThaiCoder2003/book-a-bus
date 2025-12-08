const busService = require('../services/busService')
const handleError = require('../utils/handleError')

const busController = {
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

    updateBus: async (req, res) => {
        try {
            const { id } = req.params
            const updated = await busService.editBusInfo(id, req.body)
            return res.status(200).json({
                success: true,
                message: 'Bus updated successfully',
                data: updated,
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
}

module.exports = busController
