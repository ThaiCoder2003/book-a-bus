const stationService = require('../services/stationService')
const handleError = require('../utils/handleError')

const stationController = {
    getAllStations: async (req, res) => {
        try {
            const result = await stationService.getStations()
            res.status(200).json({
                message: 'Get station list successfully',
                result
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    registerNewStation: async (req, res) => {
        try {
            const data = req.body
            const newStation = await stationService.registerNewStation(data)
            return res.status(201).json({
                message: 'Station created successfully',
                station: newStation,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    updateStation: async (req, res) => {
        try {
            const { id } = req.params
            const updated = await stationService.updateStation(id, req.body)
            return res.status(200).json({
                success: true,
                message: 'Station updated successfully',
                station: updated,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    deleteStation: async (req, res) => {
        try {
            const { id } = req.params
            await stationService.deleteStation(id)
            return res.status(200).json({
                success: true,
                message: 'Station deleted successfully',
            })
        } catch (error) {
            handleError(res, error)
        }
    },
}

module.exports = stationController
