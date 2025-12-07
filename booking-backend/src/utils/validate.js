const prisma = require('../configs/db')

function throwError(message, statusCode) {
    const err = new Error(message)
    err.statusCode = statusCode
    throw err
}

module.exports.validateTripPayload = async (data, options = { requireAll: true, existingTrip: null }) => {
    const {
        busId,
        originStationId,
        destStationId,
        departureTime,
        arrivalTime,
        price
    } = data

    const existing = options.existingTrip;

    if (options.requireAll) {
        if (!busId || !originStationId || !destStationId || !departureTime || !arrivalTime || price === undefined) {
            throwError('Bad Request: Missing required trip fields', 400);
        }
    }

    //
    // 1. Validate BUS
    //

    if (busId) {
        const bus = await prisma.bus.findUnique({ where: { id: busId } })
        if (!bus) throwError('Not Found: Bus does not exist', 404)
    }

    //
    // 2. Validate ORIGIN Station
    //
    if (originStationId) {
        const origin = await prisma.station.findUnique({ where: { id: originStationId } })
        if (!origin) throwError('Not Found: Origin station does not exist', 404)
    }

    //
    // 3. Validate DEST Station
    //
    if (destStationId) {
        const dest = await prisma.station.findUnique({ where: { id: destStationId } })
        if (!dest) throwError('Not Found: Destination station does not exist', 404)
    }
    //
    // 4. Prevent origin = destination
    //
    // Case A: Both new values provided → classic validation
    if (originStationId && destStationId && originStationId === destStationId) {
        throwError('Bad Request: Origin and destination stations cannot be the same', 400)
    }

    // Case B: Only origin changed → compare against existing destination
    if (originStationId && !destStationId && existing) {
        if (originStationId === existing.destStationId) {
            throwError('Bad Request: Origin station cannot be the same as destination station', 400)
        }
    }

    // Case C: Only destination changed → compare against existing origin
    if (!originStationId && destStationId && existing) {
        if (destStationId === existing.originStationId) {
            throwError('Bad Request: Destination station cannot be the same as origin station', 400)
        }
    }

    //
    // 5. Validate time logic
    //
    if (departureTime && arrivalTime) {
        const dep = new Date(departureTime)
        const arr = new Date(arrivalTime)

        if (arr <= dep) {
            throwError('Bad Request: Arrival time must be after departure time', 400)
        }
    }

    //
    // 6. Validate price
    //
    if (price !== undefined && price <= 0) {
        throwError('Bad Request: Price must be greater than 0', 400)
    }

    return true
}
