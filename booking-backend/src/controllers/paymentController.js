const paymentService = require("../services/paymentService");
const handleError = require("../utils/handleError");

const paymentController = {
    createZaloPayPayment: async (req, res) => {
        try {
            const { bookingId } = req.params;
            const { amount } = req.body;
            const result = await paymentService.createZaloPayPayment({ bookingId, amount });
            res.status(200).json({
                message: 'ZaloPay payment created successfully',
                data: result
            });
        } catch (error) {
            handleError(res, error);
        }
    }
};

module.exports = paymentController;