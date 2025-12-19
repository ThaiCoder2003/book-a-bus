const { get } = require('http')
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

    getSeatById: async (req, res) => {
        try {
            const seatId = req.params.seatId
            const seat = await seatService.getSeatById(seatId)
            return res.status(200).json({
                message: 'Lấy dữ liệu thành công.',
                data: seat,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    saveSeatLayout: async (req, res) => {
        try {
            const busId = req.params.busId
            const seats = req.body.seats
            const result = await seatService.saveSeatLayout(busId, seats)
            return res.status(200).json({
                message: 'Lưu bố cục ghế thành công.',
                data: result,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    checkSeatOverlap: async (req, res) => {
        try {
            const { tripId, seatId, fromOrder, toOrder } = req.query
            const isOverlap = await seatService.checkSeatOverlap(tripId, seatId, parseInt(fromOrder), parseInt(toOrder))
            return res.status(200).json({
                message: 'Kiểm tra chỗ ngồi thành công.',
                data: { isOverlap },
            })
        } catch (error) {
            handleError(res, error)
        }
    },
}

module.exports = seatController
