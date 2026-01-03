const validatePayload = require("../utils/validate");
const prisma = require("../configs/db");

const { SeatType } = require('@prisma/client')

const busService = {
  getBuses: async (searchTerm) => {
    const [buses, countBus] = await Promise.all([
        prisma.bus.findMany({
            where: searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { plateNumber: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }
      : undefined,
        include: {
          _count: {
            select: {
              seats: true // Thêm cái này để FE biết xe đã vẽ sơ đồ chưa
            }
          }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.bus.count(),
    ]);

    const countSeat = await prisma.seat.count()

    return { buses, countBus, countSeat };
  },

  getBusById: async (busId) => {
    return prisma.bus.findUnique({
      where: { id: busId },
      include: {
        seats: true,
        trips: true
      },
    });
  },

  registerNewBus: async (payload) => {
    await validatePayload.validateBusPayload(payload, { requireAll: true });

    return prisma.$transaction(async (tx) => {
      // 1. Tạo Bus
      const bus = await tx.bus.create({
        data: {
          name: payload.name,
          plateNumber: payload.plateNumber,
          totalSeats: Number(payload.totalSeats),
        },
      });

      // 2. Tạo ghế mặc định (Hàng dọc 4 ghế, tất cả là SEAT)
      const seats = [];
      const total = Number(payload.totalSeats);

      for (let i = 1; i <= total; i++) {
        seats.push({
          busId: bus.id,
          label: `S${i}`, 
          floor: 1,
          row: Math.ceil(i / 4), // Mặc định chia 4 cột để Admin dễ nhìn
          col: ((i - 1) % 4) + 1,
          type: SeatType.SEAT, 
        });
      }

      await tx.seat.createMany({ data: seats });

      return bus;
    });
  },

  editBusInfo: async (id, data) => {
    const exists = await prisma.bus.findUnique({ 
      where: { id },
      include: { _count: { select: { trips: true } } } 
    });

    if (!exists) {
      const err = new Error("Not found: Bus not found");
      err.statusCode = 404;
      throw err;
    }

    await validatePayload.validateBusPayload(data, {
      requireAll: false,
      existingTrip: exists,
    });

    return prisma.bus.update({
      where: { id },
      data: {
        name: data.name,
        plateNumber: data.plateNumber,
      }
    });
  },

  deleteBus: async (id) => {
    const exists = await prisma.bus.findUnique({ where: { id } });
    if (!exists) {
      const err = new Error("Not found: Bus not found");
      err.statusCode = 404;
      throw err;
    }

    if (exists._count.trips > 0) {
      const err = new Error("Không thể xóa xe đã có lịch trình chuyến đi!");
      err.statusCode = 400;
      throw err;
    }

    return prisma.$transaction(async (tx) => {
      await tx.seat.deleteMany({ where: { busId: id } });
      return tx.bus.delete({ where: { id } });
    });
  },

  updateBusSeats: async (busId, seatsArray) => {
    return prisma.$transaction(async (tx) => {
      await tx.seat.deleteMany({ where: { busId } });
      return tx.seat.createMany({
        data: seatsArray.map(s => ({
          busId: busId,
          label: s.label,
          row: s.row,
          col: s.col,
          floor: s.floor || 1,
          type: s.type
        }))
      });
    });
  }
};

module.exports = busService;
