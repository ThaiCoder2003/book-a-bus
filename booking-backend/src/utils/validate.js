const prisma = require("../configs/db");
const provinces = require("./provinces");

function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

const validatePayload = {
  validateTripPayload: async (
    data,
    options = { requireAll: true, existingTrip: null },
  ) => {
    const {
      busId,
      departureTime,
      routeId
    } = data;

    if (options.requireAll) {
      if (
        !busId ||
        !departureTime ||
        !routeId
      ) {
        throwError("Bad Request: Missing required trip fields", 400);
      }
    }

    //
    // 1. Validate BUS
    //

    if (busId) {
      const bus = await prisma.bus.findUnique({ where: { id: busId } });
      if (!bus) throwError("Not Found: Bus does not exist", 404);
    }


    if (routeId) {
      const exists = prisma.route.findUnique({ where: { id: routeId } });
      if (!exists) {
        throwError("Bad Request: This route does not exist", 400);
      }
    }

    const checkConflict = await prisma.trip.findFirst({
        where: {
          busId: busId,
          departureTime: departureTime // Hoặc check trong khoảng +- vài tiếng
        }
    });

    if (checkConflict) {
        throwError("Xe này đã có lịch chạy vào thời điểm này!", 400);
    }

    return true;
  },

  validateBusPayload: async (
    data,
    options = { requireAll: true, existingBus: null },
  ) => {
    const { plateNumber, name, totalSeats } = data;

    const existing = options.existingBus;

    //
    // 0. Required field enforcement
    //
    if (options.requireAll) {
      if (!plateNumber || !name || totalSeats === undefined) {
        throwError("Bad Request: Missing required bus fields", 400);
      }
    }

    //
    // 1. Validate plateNumber
    //
    if (plateNumber) {
      // Basic format check (very flexible — adjust if needed)
      const plateRegex = /^[A-Za-z0-9\-\.]{4,20}$/;
      if (!plateRegex.test(plateNumber)) {
        throwError("Bad Request: Invalid plate number format", 400);
      }

      // Uniqueness: (plateNumber + type) must be unique
      const conflict = await prisma.bus.findFirst({
        where: {
          plateNumber,
          // exclude current bus on update
          NOT: existing ? { id: existing.id } : undefined,
        },
      });

      if (conflict) {
        throwError(
          "Conflict: Bus with same plate number and type already exists",
          409,
        );
      }
    }

    //
    // 2. Validate totalSeats
    //
    if (totalSeats !== undefined) {
      if (!Number.isInteger(totalSeats) || totalSeats < 0) {
        throwError(
          "Bad Request: totalSeats must be a non-negative integer",
          400,
        );
      }
    }

    //
    // 4. Validate name (optional)
    //
    if (name !== undefined && name !== null) {
      if (typeof name !== "string" || name.trim().length === 0) {
        throwError("Bad Request: Bus name must be a non-empty string", 400);
      }
      if (name.length > 50) {
        throwError(
          "Bad Request: Bus name is too long (max 50 characters)",
          400,
        );
      }
    }

    return true;
  },

  validateStationPayload: async (
    data,
    options = { requireAll: true, existingStation: null },
  ) => {
    const { name, province, address } = data;

    const { requireAll } = options;

    const existingStation = await prisma.station.findFirst({
      where: {
        name: name,
        province: province,
      },
    });

    if (
      existingStation &&
      (!options.existingStation ||
        existingStation.id !== options.existingStation.id)
    ) {
      throwError("Station already exists in this province", 409);
    }

    if (requireAll) {
      if (!name || !province) {
        throwError("Bad Request: Missing required station fields", 400);
      }
    }

    if (name) {
      if (name.trim().length < 3) {
        throwError("Bad Request: Station name is too short", 400);
      }

      if (!/^[\p{L}\p{N}\s.,-]+$/u.test(name)) {
        throwError(
          "Bad Request: Station name contains invalid characters",
          400,
        );
      }
    }

    if (province) {
      if (!provinces.includes(province)) {
        throwError("Invalid province name", 400);
      }
    }

    if (address) {
      if (address.trim().length < 3) {
        throwError("Bad Request: Station name is too short", 400);
      }
    }
  },

  validateRoutePayload: async (data, options = { requireAll: true }) => {
    const { name } = data;

    const { requireAll } = options;

    // 1️⃣ Check required
    if (requireAll) {
      if (!name) {
        throwError("Bad Request: Missing required route fields", 400);
      }
    }

    if (name) {
      // 2️⃣ Check length
      if (name.trim().length < 3) {
        throwError("Bad Request: Route name is too short", 400);
      }

      // 3️⃣ Check valid characters
      if (!/^[\p{L}\p{N}\s.,-]+$/u.test(name)) {
        throwError("Bad Request: Route name contains invalid characters", 400);
      }
    }
  },
};

module.exports = validatePayload;
