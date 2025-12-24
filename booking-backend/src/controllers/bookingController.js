const bookingService = require('../services/bookingService')

const bookingController = {
    createBooking: async (req, res) => {
        try {
            const userId = req.user.id
            const booking = await bookingService.createBooking({
                userId,
                ...req.body,
            })
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
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    },
}

module.exports = bookingController
