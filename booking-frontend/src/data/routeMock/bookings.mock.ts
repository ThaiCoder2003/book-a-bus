import type { Booking } from "@/types/booking.type";
import { TRIPS_MOCK } from "./trips.mock";
import { STATIONS_MOCK } from "./stations.mock";

export const BOOKINGS_MOCK: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    tripId: TRIPS_MOCK[0].id,
    status: "CONFIRMED",
    totalAmount: 350000,

    departureStationId: STATIONS_MOCK[0].id,
    arrivalStationId: STATIONS_MOCK[2].id,

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),

    paymentTime: new Date().toISOString(),
    paymentRef: "ZLPAY_TEST_001",

    trip: TRIPS_MOCK[0],
    departureStation: STATIONS_MOCK[0],
    arrivalStation: STATIONS_MOCK[2],
    tickets: [],
    ticketCount: 0
  },
];
