const busAdminService = require('../../services/admin/busAdminService');
const handleError = require('../../utils/handleError');

const busAdminController = {
    registerNewBus: async (req, res) => {
        try {
            const data = req.body;
            const newBus = await busAdminService.registerNewBus(data);
            return res.status(201).json({
                message: 'Bus created successfully',
                bus: newBus,
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    updateBus: async (req, res) => {
        try {
            const { id } = req.params;
            const updated = await busAdminService.editBusInfo(id, req.body);
            return res.status(200).json({
                success: true,
                message: "Bus updated successfully",
                data: updated
            });
        } catch (error) {
            handleError(res, error);
        }
    },

    deleteBus: async (req, res) => {
        try {
            const { id } = req.params;
            await busAdminService.deleteBus(id);
            return res.status(200).json({
                success: true,
                message: "Bus deleted successfully"
            });
        } catch (error) {
            handleError(res, error);
        }
    }
}

module.exports = busAdminController;