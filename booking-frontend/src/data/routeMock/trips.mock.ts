import type { Trip } from "@/types/trip.type";
import { ROUTES_MOCK } from "./routes.mock";

export const TRIPS_MOCK: Trip[] = [
  {
    id: "trip-1",
    busId: "bus-1",
    routeId: ROUTES_MOCK[0].id,
    departureTime: "2025-01-01T08:00:00.000Z",
    route: ROUTES_MOCK[0],
  },
];
