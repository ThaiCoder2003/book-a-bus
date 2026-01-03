const paymentService = require('../services/paymentService')
const handleError = require('../utils/handleError')

const paymentController = {
    createPayPayment: async (req, res) => {
        try {
            const { bookingId } = req.params
            const result = await paymentService.createZaloPayPayment({
                bookingId,
            })
            res.status(201).json({
                message: 'ZaloPay payment created successfully',
                data: result,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    callbackZaloPay: async (req, res) => {
        try {
            const { data, mac } = req.body // ZaloPay gửi data và mac trong body
            const result = await paymentService.handleZaloPayCallback(data, mac)

            // ZaloPay yêu cầu response json
            res.json(result)
        } catch (error) {
            res.status(500).json({
                return_code: 0,
                return_message: error.message,
            })
        }
    },
}

module.exports = paymentController
