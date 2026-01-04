const bookingService = require('../services/bookingService')

const bookingController = {
    create: async (req, res) => {
        try {
            const userId = req.user.userId

            const booking = await bookingService.create({
                userId,
                ...req.body,
            })

            return res.json({
                success: true,
                booking,
            })
        } catch (error) {
            if (error.message === 'SEAT_ALREADY_TAKEN') {
                return res.status(409).json({
                    success: false,
                    message:
                        'Một hoặc nhiều ghế bạn chọn vừa được người khác đặt. Vui lòng chọn lại.',
                })
            }

            if (error.message === 'INVALID_NUMBER_SEATS') {
                return res.status(400).json({
                    success: false,
                    message:
                        'Số lượng ghế không hợp lệ. Vui lòng chọn ít nhất 1 ghế và tối đa 5 ghế.',
                })
            }

            console.error(error)
            return res
                .status(500)
                .json({ message: error.message || 'Internal Server Error' })
        }
    },

    getByUserId: async (req, res) => {
        try {
            const userId = req.params.userId
            const result = await bookingService.getByUser(userId)

            return res.status(200).json({
                success: true,
                booking: result,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: error.message || 'Internal Server Error',
            })
        }
    },

    getById: async (req, res) => {
        try {
            const bookingId = req.params.bookingId

            if (!bookingId) {
                return res.status(400).json({ message: 'Thiếu ID đơn hàng' })
            }

            // 1. Gọi Service để lấy dữ liệu
            const booking = await bookingService.getById(bookingId)

            // 2. Kiểm tra kết quả từ Service
            if (!booking) {
                // Nếu null nghĩa là không tìm thấy hoặc đã hết hạn (theo logic query bên service)
                return res.status(404).json({
                    message:
                        'Đơn hàng không tồn tại hoặc đã hết hạn thanh toán.',
                })
            }

            // 3. Trả về kết quả thành công
            return res.status(200).json(booking)
        } catch (error) {
            console.error('Controller Error:', error)
            return res.status(500).json({
                message: 'Lỗi hệ thống',
                error: error.message,
            })
        }
    },

    getByIdForAdmin: async (req, res) => {
        try {
            const bookingId = req.params.id

            if (!bookingId) {
                return res.status(400).json({ message: 'Thiếu ID đơn hàng' })
            }

            // 1. Gọi Service để lấy dữ liệu
            const booking = await bookingService.getBookingById(bookingId)

            // 2. Kiểm tra kết quả từ Service
            if (!booking) {
                // Nếu null nghĩa là không tìm thấy hoặc đã hết hạn (theo logic query bên service)
                return res.status(404).json({
                    message:
                        'Đơn hàng không tồn tại hoặc đã hết hạn thanh toán.',
                })
            }

            // 3. Trả về kết quả thành công
            return res.status(200).json(booking)
        } catch (error) {
            console.error('Controller Error:', error)
            return res.status(500).json({
                message: 'Lỗi hệ thống',
                error: error.message,
            })
        }
    },

    getAll: async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                status,
                route,
                startDate,
                endDate,
                query,
            } = req.query

            const result = await bookingService.getAll({
                page: parseInt(page),
                limit: parseInt(limit),
                status,
                route,
                startDate,
                endDate,
                query,
            })

            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    cancel: async (req, res) => {
        try {
            const bookingId = req.params.bookingId

            const cancelled = await bookingService.cancelTicket(bookingId)

            return res.status(200).json({
                message: 'Hủy Đăng ký thành công',
                updated: cancelled,
            })
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    },
}

module.exports = bookingController
