const dashboardService = require("../services/dashboardService");
const handleError = require("../utils/handleError");

const dashboardController = {
    getSummary: async (req, res) => {
        try {
            const result = await dashboardService.summary();
            res.status(200).json(result)
        }

        catch (error) {
            handleError(res, error);
        }
    },

    weeklyChart: async (req, res) => {
        try {
            const result = await dashboardService.weeklyChart();
            res.status(200).json(result)
        }

        catch (error) {
            handleError(res, error);
        }
    },

    recentBooking: async (req, res) => {
        try {
            const result = await dashboardService.recentBooking();
            res.status(200).json(result)
        }

        catch (error) {
            handleError(res, error);
        }
    },

    yearlyRevenue: async (req, res) => {
        try {
            const result = await dashboardService.yearlyRevenue();
            res.status(200).json(result)
        }
        catch (error) {
            handleError(res, error);
        }
    },
}

module.exports = dashboardController;   
