import type { Booking } from "../types/booking.type";

export const paymentMock: Booking[] = [
  {
    id: "txn-001",
    userId: "user-001",
    tripId: "trip-001",
    status: "CONFIRMED",
    totalAmount: 150000,
    departureStationId: "station-001",
    arrivalStationId: "station-002",
    createdAt: new Date("2025-12-01T10:00:00Z").toISOString(),
    updatedAt: new Date("2025-12-01T10:05:00Z").toISOString(),
    expiredAt: new Date("2025-12-25T23:59:59Z").toISOString(),
    paymentTime: new Date("2025-12-01T10:05:00Z").toISOString(),
    paymentRef: "ZALOPAY_SANDBOX_001",
    user: {
      id: "user-001",
      email: "nguyen@example.com",
      name: "Nguyen Van A",
      passwordHash: "hashed",
      phone: "0901234567",
      role: "USER",
      createdAt: new Date("2025-11-20T12:00:00Z").toISOString(),
      updatedAt: new Date("2025-11-20T12:00:00Z").toISOString(),
    },
    trip: {
      id: "trip-001",
      busId: "bus-001",
      routeId: "route-001",
      departureTime: new Date("2025-12-01T08:00:00Z").toISOString(),
      route: { id: "route-001", name: "Hà Nội - Sài Gòn" },
    },
    departureStation: {
      id: "station-001",
      name: "Hà Nội",
      address: "",
      province: "",
    },
    arrivalStation: {
      id: "station-002",
      name: "Sài Gòn",
      address: "",
      province: "",
    },
    tickets: [],
  },
];
