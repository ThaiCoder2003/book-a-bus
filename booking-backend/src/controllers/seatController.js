const seatService = require('../services/seatService')
const handleError = require('../utils/handleError')

const seatController = {
    getAllSeat: async (req, res) => {
        // get all seat by bus
        try {
            const busId = req.params.busId

            if (busId) {
                const results = await seatService.getSeatsByBusId(busId)

                if (results) {
                    return res.status(200).json({
                        message: 'Lấy dữ liệu thành công.',
                        data: results,
                    })
                } else {
                    throw new Error('Không lấy được danh sách ghế theo xe.')
                }
            } else {
                throw new Error('Không tìm được id của xe.')
            }
        } catch (error) {
            handleError(res, error)
        }
    },
}

module.exports = seatController
