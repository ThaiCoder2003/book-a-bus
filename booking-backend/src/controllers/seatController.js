const seatService = require('../services/seatService')
const handleError = require('../utils/handleError')

const seatController = {
    getAll: async (req, res) => {
        // get all seat by trip
        try {
            const tripId = req.params.tripId

            if (busId) {
                const results = await seatService.getSeatByTrip(tripId)

                if (results) {
                    return res.status(200).json({
                        message: 'Lấy dữ liệu thành công.',
                        data: results,
                    })
                } else {
                    throw new Error('Không lấy được danh sách ghế theo chuyến đi.')
                }
            } else {
                throw new Error('Không tìm được id của chuyến đi.')
            }
        } catch (error) {
            handleError(res, error)
        }
    },
}

module.exports = seatController
