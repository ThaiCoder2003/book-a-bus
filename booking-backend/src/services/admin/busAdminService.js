const busAction  = require('../../actions/busAction')
const { validateBusPayload } = require('../../utils/validate')

const busAdminService = {
    registerNewBus: async (data) => {
        await validateBusPayload(data, { requireAll: true });
        return busAction.registerNewBus(data);
    },

    editBusInfo: async (id, data) => {
        const exists = await busAction.getBusById(id);
        if (!exists) {
            const err =  new Error('Not found: Bus not found');
            err.statusCode = 404;
            throw err;
        }

        await validateBusPayload(data, { requireAll: false, existingTrip: exists });

        return busAction.updateBus(id, data);
    },

    deleteBus: async (tripId) => {
        const exists = await busAction.getBusById(tripId)
        if (!exists) {
            const err =  new Error('Not found: Bus not found');
            err.statusCode = 404;
            throw err;
        }

        return busAction.deleteBus(tripId)
    },
}

module.exports = busAdminService;
