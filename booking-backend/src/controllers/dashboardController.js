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

    financeAnalysis: async (req, res) => {
        try {
            const result = await dashboardService.financeAnalysis();
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

    monthlyRevenue: async (req, res) => {
        try {
            const result = await dashboardService.monthlyRevenue();
            res.status(200).json(result)
        }
        catch (error) {
            handleError(res, error);
        }
    },

    getTransactions: async (req, res) => {
        try {
            const result = await dashboardService.getTransactions()
            res.status(200).json(result)
        }
        catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = dashboardController;   
