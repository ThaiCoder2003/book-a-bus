const paymentService = require("../services/paymentService");
const handleError = require("../utils/handleError");

const paymentController = {
    createPayPayment: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const { amount } = req.body;
            const result = await paymentService.createZaloPayPayment({ bookingId, amount });
            res.status(201).json({
                message: 'ZaloPay payment created successfully',
                data: result
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    zaloCallback: async (req, res) => {
        try {
            const { data, mac } = req.body;
            const result = await paymentService.handleZaloPayCallback(data, mac)
            res.status(200).json(result);
        } catch (error) {
            handleError(res, error);
        }
    },

};

module.exports = paymentController;