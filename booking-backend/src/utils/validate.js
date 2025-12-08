const prisma = require('../configs/db')

function throwError(message, statusCode) {
    const err = new Error(message)
    err.statusCode = statusCode
    throw err
}

const validatePayload = {
    validateTripPayload: async (data, options = { requireAll: true, existingTrip: null }) => {
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
    },
    
    validateBusPayload: async (data, options = { requireAll: true, existingBus: null }) => {
        const {
            plateNumber,
            name,
            totalSeats,
            type
        } = data;
    
        const existing = options.existingBus;
    
        //
        // 0. Required field enforcement
        //
        if (options.requireAll) {
            if (!plateNumber || !type || totalSeats === undefined) {
                throwError('Bad Request: Missing required bus fields', 400);
            }
        }
    
        //
        // 1. Validate plateNumber
        //
        if (plateNumber) {
            // Basic format check (very flexible — adjust if needed)
            const plateRegex = /^[A-Za-z0-9\-\.]{4,20}$/;
            if (!plateRegex.test(plateNumber)) {
                throwError('Bad Request: Invalid plate number format', 400);
            }
    
            // Uniqueness: (plateNumber + type) must be unique
            const conflict = await prisma.bus.findFirst({
                where: {
                    plateNumber,
                    type,
                    // exclude current bus on update
                    NOT: existing ? { id: existing.id } : undefined
                }
            });
    
            if (conflict) {
                throwError('Conflict: Bus with same plate number and type already exists', 409);
            }
        }
    
        //
        // 2. Validate type
        //
        if (type) {
            const validTypes = ['SEAT', 'SINGLE_BED', 'DOUBLE_BED'];
            if (!validTypes.includes(type)) {
                throwError('Bad Request: Invalid bus seat type', 400);
            }
        }
    
        //
        // 3. Validate totalSeats
        //
        if (totalSeats !== undefined) {
            if (!Number.isInteger(totalSeats) || totalSeats < 0) {
                throwError('Bad Request: totalSeats must be a non-negative integer', 400);
            }
        }
    
        //
        // 4. Validate name (optional)
        //
        if (name !== undefined && name !== null) {
            if (typeof name !== 'string' || name.trim().length === 0) {
                throwError('Bad Request: Bus name must be a non-empty string', 400);
            }
            if (name.length > 50) {
                throwError('Bad Request: Bus name is too long (max 50 characters)', 400);
            }
        }
    
        return true;
    }
}

module.exports = validatePayload