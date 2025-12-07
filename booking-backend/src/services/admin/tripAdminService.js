const tripAction  = require('../../actions/tripAction')
const { validateTripPayload } = require('../../utils/validate')

const tripAdminService = {
    registerNewTrip: async (data) => {
        await validateTripPayload(data, { requireAll: true })
        return tripAction.createTrip(data)
    },

    editTripInfo: async (id, data) => {
        const exists = await tripAction.getTripById(id);
        if (!exists) {
            const err =  new Error('Not found: Trip not found');
            err.statusCode = 404;
            throw err;
        }

        await validateTripPayload(data, { requireAll: false, existingTrip: exists });

        return tripAction.updateTrip(id, data);
    },

    deleteTrip: async (tripId) => {
        const exists = await tripAction.getTripById(tripId)
        if (!exists) {
            const err =  new Error('Not found: Trip not found');
            err.statusCode = 404;
            throw err;
        }

        return tripAction.deleteTrip(tripId)
    },
}

module.exports = tripAdminService;
