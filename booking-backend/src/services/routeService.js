const validatePayload = require("../utils/validate");
const prisma = require("../configs/db");

function throwError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
}

const routeService = {
  findRoutes: async (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [routes, total] = await prisma.$transaction([
      prisma.route.findMany({
        where: query ? 
        {
          name: { contains: query, mode: 'insensitive' }
        }
      : undefined,
        skip,
        take: limit,
        include: {
          route_station: {
            include: { station: true },
            orderBy: { order: 'asc' }
          },
          trips: true,
          _count: {
            select: {
              route_station: true,
              trips: true
            }
          }
        },
      }),

      prisma.route.count({
        where: query ? 
        {
          name: { contains: query, mode: 'insensitive' }
        }
        : undefined}
      )
    ])

    const formattedRoutes = routes.map(route => {
      const stops = route.route_station;
      return {
        ...route,
        startLocation: stops.length > 0 ? stops[0].station.name : "N/A",
        endLocation: stops.length > 0 ? stops[stops.length - 1].station.name : "N/A",
      };
    });

    return {
      routes: formattedRoutes,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  getRouteById: async (id) => {
    const route = await prisma.route.findUnique({
      where: { id: id },
      include: {
        trips: true,
        route_station: {
          include: {
            station: true // <--- Phải có dòng này mới lấy được tên, địa chỉ trạm
          },
          orderBy: {
            order: 'asc' // <--- Sắp xếp luôn từ Backend cho tiện
          }
        }
      },
    });
    
    if (!route) throwError("Route not found", 404);

    // Map lại thành 'stops' để khớp với Interface Frontend của bạn
    return {
      ...route,
      stops: route.route_station
    };
  },
  
  createRouteWithStops: async (payload) => {
    const { name, stops } = payload;

    if (!name || !Array.isArray(stops) || stops.length < 2) {
      throwError("Route must have at least 2 stops", 400);
    }

    // 1️⃣ Validate order: phải là 1..n, không nhảy cóc
    const orders = stops.map(s => s.order).sort((a, b) => a - b);

    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i + 1) {
        throwError("Stop orders must be sequential starting from 1", 400);
      }
    }

    return await prisma.route.create({
      data: {
        name,
        route_station: { // Lưu ý: Tên relation trong schema của bạn (có thể là route_station hoặc routeStations)
          create: stops.map((stop) => {
            // Rule cho trạm đầu
            if (stop.order === 1 && (stop.distanceFromStart !== 0 || stop.durationFromStart !== 0)) {
              throwError("First stop stats must be 0", 400);
            }

            return {
              stationId: stop.stationId,
              order: stop.order,
              distanceFromStart: stop.distanceFromStart || 0,
              durationFromStart: stop.durationFromStart || 0,
              priceFromStart: stop.priceFromStart || 0,
            };
          }),
        },
      },
    });
  },

  createNewStop: async (data, { skipOrderShift = false } = {}) => {
    const {
      routeId,
      stationId,
      order,
      durationFromStart,
      distanceFromStart,
      price,
    } = data;

    if (!routeId || !stationId || order === undefined) {
      throwError("Missing required fields", 400);
    }
    // 1. check route
    const route = await prisma.route.findUnique({ where: { id: routeId } });
    if (!route) {
      throwError("Route not found", 404);
    }

    // 2. Check station
    const station = await prisma.station.findFirst({
      where: { id: stationId },
    });
    if (!station) {
      throwError("Station not found", 404);
    }
    // 4. check duplicate station in same route
    const stationExists = await prisma.route_Station.findFirst({
      where: { routeId, stationId },
    });
    if (stationExists) {
      throwError("Station already exists in this route", 409);
    }

    if (order < 1) {
      throwError("Order must be >= 1", 400);
    }

    // 5. If orer is 1, durationFromStart and distanceFromStart must be 0
    if (order === 1) {
      if (
        (durationFromStart && durationFromStart !== 0) ||
        (distanceFromStart && distanceFromStart !== 0) ||
        (price && price !== 0)
      ) {
        throwError(
          "For the first stop, durationFromStart, distanceFromStart and price must be 0",
          400,
        );
      }
    }
    return prisma.$transaction(async (tx) => {
      // 6. Before creating, move all the orders >= this order up by 1
      if (!skipOrderShift) {
        const maxOrder = await prisma.route_Station.aggregate({
          where: { routeId },
          _max: { order: true },
        });

        if (order > (maxOrder._max.order ?? 0) + 1) {
          throwError("Order is out of range", 400);
        }

        await tx.route_Station.updateMany({
          where: {
            routeId,
            order: { gte: order },
          },
          data: {
            order: { increment: 1 },
          },
        });
      }

      return tx.route_Station.create({
        data: {
          routeId,
          stationId: station.id,
          order,
          durationFromStart: durationFromStart ?? 0,
          distanceFromStart: distanceFromStart ?? 0,
          price: price ?? 0,
        },
      });
    });
  },

  deleteRoute: async (id) => {
    const exists = await prisma.route.findUnique({ where: { id } });
    if (!exists) throwError("Route not found", 404);

    // Dùng $transaction để đảm bảo tính toàn vẹn dữ liệu
    return prisma.$transaction(async (tx) => {
      // 1. Xóa tất cả các trạm dừng thuộc tuyến này
      await tx.route_Station.deleteMany({
        where: { routeId: id }
      });

      // 2. Xóa tất cả các chuyến xe thuộc tuyến này (Cẩn thận: nếu có vé thì phải xóa vé trước nữa)
      await tx.trip.deleteMany({
        where: { routeId: id }
      });

      // 3. Cuối cùng mới xóa Tuyến đường
      return tx.route.delete({
        where: { id }
      });
    });
  },
};

module.exports = routeService;
