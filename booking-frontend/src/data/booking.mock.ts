// data/booking.mock.ts
import type { Booking } from "../types/booking.type";
const baseUser = {
  passwordHash: "hashed_password",
  currentHashedRefreshToken: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
export const mockBookings: Booking[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    userId: "user-1",
    tripId: "trip-101",
    status: "CONFIRMED",
    totalAmount: 850000,
    departureStationId: "st-hn",
    arrivalStationId: "st-hcm",
    createdAt: "2024-12-01T08:00:00Z",
    updatedAt: "2024-12-01T09:00:00Z",
    expiredAt: null,

    user: {
      id: "user-1",
      name: "Nguyễn Văn A",
      email: "vana@gmail.com",
      phone: "0901234567",
      role: "USER",
      ...baseUser,
    },
    trip: {
      id: "trip-101",
      busId: "bus-v1",
      routeId: "route-hn-hcm",
      departureTime: "2024-12-20T19:00:00Z",
      route: { id: "r1", name: "Hà Nội - TPHCM" },
    },
    departureStation: {
      id: "st-hn",
      name: "Bến xe Mỹ Đình",
      province: "Hà Nội",
      address: "Số 2 Phạm Hùng",
    },
    arrivalStation: {
      id: "st-hcm",
      name: "Bến xe Miền Đông",
      province: "TPHCM",
      address: "292 Đinh Bộ Lĩnh",
    },
    tickets: [
      {
        id: "tk1",
        bookingId: "550e8400-e29b-41d4-a716-446655440000",
        seatId: "s1",
        tripId: "trip-101",
        fromOrder: 1,
        toOrder: 10,
      },
    ],
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440111",
    userId: "user-2",
    tripId: "trip-102",
    status: "PENDING",
    totalAmount: 200000,
    departureStationId: "st-hn",
    arrivalStationId: "st-hp",
    createdAt: "2024-12-10T14:00:00Z",
    updatedAt: "2024-12-10T14:00:00Z",
    expiredAt: null,

    user: {
      id: "user-2",
      name: "Trần Thị B",
      email: "thib@gmail.com",
      phone: "0988777666",
      role: "USER",
      ...baseUser,
    },
    trip: {
      id: "trip-102",
      busId: "bus-v2",
      routeId: "route-hn-hp",
      departureTime: "2024-12-15T07:30:00Z",
      route: { id: "r2", name: "Hà Nội - Hải Phòng" },
    },
    departureStation: {
      id: "st-hn",
      name: "Bến xe Gia Lâm",
      province: "Hà Nội",
      address: "Gia Thụy",
    },
    arrivalStation: {
      id: "st-hp",
      name: "Bến xe Niệm Nghĩa",
      province: "Hải Phòng",
      address: "Lê Chân",
    },
    tickets: [],
  },
];
