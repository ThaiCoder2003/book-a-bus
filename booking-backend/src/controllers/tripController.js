const tripService = require('../services/tripService')
const handleError = require('../utils/handleError')

const isValidDate = (dateString) => {
    if (typeof dateString !== 'string') return false

    const date = new Date(dateString)

    return !isNaN(date.getTime())
}

const tripController = {
    getAllTrips: async (req, res) => {
        try {
            const {
                origin,
                destination,
                date,
                seatType,
                departureTime,
                sortBy,
                page,
            } = req.query

            if (date && !isValidDate(date)) {
                return res.status(400).json({
                    message: 'Ngày khởi hành không hợp lệ.',
                    data: null,
                })
            }

            const filter = {
                from: origin,
                to: destination,
                departureDay: date,
                seatType,
                departureTime,
                sortBy,
            }

            const result = await tripService.getAllTrips(filter, page)

            return res.status(200).json({
                message: 'Get trips list successfully',
                data: result,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getAll: async (req, res) => {
        try {
            console.log("Lấy nè!");
            // Admin thường cần xem tất cả, phân trang đơn giản
            const { query } = req.query;
            const result = await tripService.getAll(query);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getTripDetail: async (req, res) => {
        try {
            const id = req.params.id
            const result = await tripService.getTripDetailById(id)

            if (result) {
                return res.status(200).json({
                    message: 'Lấy dữ liệu thành công',
                    data: result,
                })
            } else {
                throw new Error('Không thể lấy dữ liệu chuyến đi này.')
            }
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
                trip: updated,
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
        // ÉP HIỆN LỖI RA TERMINAL VS CODE
            console.error(error.code);
            console.error(error.meta);
            console.error(error.message);
            return res.status(500).json({ 
                success: false, 
                error: error.message,
                stack: error.stack // Hiện cả dòng bị lỗi cho Admin xem luôn
            });
        }
    },
}

module.exports = tripController
