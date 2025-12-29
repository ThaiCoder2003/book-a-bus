const bookingService = require('../services/bookingService')

const bookingController = {
    createBooking: async (req, res) => {
        try {
            const userId = req.user.userId

            const booking = await bookingService.createBooking({
                userId,
                ...req.body,
            })
            console.log("🚀 ~ booking:", booking)

            return res.json({
                success: true,
                // paymentUrl: `https://payment-gateway...?bookingId=${booking.id}`,
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
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    },
}

module.exports = bookingController
