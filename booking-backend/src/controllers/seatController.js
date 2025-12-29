const { get } = require('http')
const seatService = require('../services/seatService')
const handleError = require('../utils/handleError')

const seatController = {
    getAll: async (req, res) => {
        // get all seat by trip
        try {
            const tripId = req.params.tripId
            const { fromOrder, toOrder } = req.query

            if (tripId) {
                const results = await seatService.getTripSeats({
                    tripId,
                    fromOrder: parseInt(fromOrder),
                    toOrder: parseInt(toOrder),
                })

                if (results) {
                    return res.status(200).json({
                        message: 'Lấy dữ liệu thành công.',
                        data: results,
                    })
                } else {
                    throw new Error(
                        'Không lấy được danh sách ghế theo chuyến đi.',
                    )
                }
            } else {
                throw new Error('Không tìm được id của chuyến đi.')
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
            const isOverlap = await seatService.checkSeatOverlap(
                tripId,
                seatId,
                parseInt(fromOrder),
                parseInt(toOrder),
            )
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
