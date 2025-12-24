const dashboardService = require("../services/dashboardService");
const handleError = require("../utils/handleError");

const dashboardController = {
    getSummary: async (req, res) => {
        try {
            const result = await dashboardService.summary();
            const recentBookings = await dashboardService.recentBooking();
            const weeklyChart = await dashboardService.weeklyChart();
            res.status(200).json({
                message: 'Get dashboard summary successfully',
                data: result,
                recentBookings,
                weeklyChart
            })
        }

        catch (error) {
            handleError(res, error);
        }
    },

    yearlyRevenue: async (req, res) => {
        try {
            const result = await dashboardService.yearlyRevenue();
            res.status(200).json({
                message: 'Get revenue data successfully',
                data: result
            })
        }
        catch (error) {
            handleError(res, error);
        }
    },
}

module.exports = dashboardController;   
