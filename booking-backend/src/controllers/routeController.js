const routeService = require('../services/routeService')
const handleError = require('../utils/handleError')

const RouteController = {
    getAllRoutes: async (req, res) => {
        try {
            const { originProvince, destProvince, code, page, limit } = req.query
            const result = await routeService.getRoutes(
                originProvince,
                destProvince,
                code,
                page,
                limit
            )
            res.status(200).json({
                message: 'Get routes list successfully',
                data: result
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getRouteById: async (req, res) => {
        try {
            const { id } = req.params
            const result = await routeService.getRouteById(id)

            res.status(200).json({
                data: result
            })
        } catch (error) {
            handleError(res, error)
        }
    },
}