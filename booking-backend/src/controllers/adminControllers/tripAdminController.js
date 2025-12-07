const tripAdminService = require('../../services/admin/tripAdminService');
const handleError = require('../../utils/handleError');

const tripAdminController = {
    registerNewTrip: async (req, res) => {
        try {
            const data = req.body;
            const newTrip = await tripAdminService.registerNewTrip(data);
            return res.status(201).json({
                message: 'Trip created successfully',
                trip: newTrip,
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    updateTrip: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await tripAdminService.editTripInfo(id, req.body);
            return res.status(200).json({
                success: true,
                message: "Trip updated successfully",
                data: updated
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    deleteTrip: async (req, res) => {
        try {
            const { id } = req.params;
            await tripAdminService.deleteTrip(id);
            return res.status(200).json({
                success: true,
                message: "Trip deleted successfully"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = tripAdminController;