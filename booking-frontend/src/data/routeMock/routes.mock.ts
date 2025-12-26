import type { Route } from "@/types/route.type";
import type { RouteStation } from "@/types/RouteStation.type";
import { STATIONS_MOCK } from "./stations.mock";

const routeStations: RouteStation[] = [
  {
    id: "rs-1",
    routeId: "route-1",
    stationId: STATIONS_MOCK[0].id,
    order: 1,
    durationFromStart: 0,
    distanceFromStart: 0,
    priceFromStart: 0,
    station: STATIONS_MOCK[0],
  },
  {
    id: "rs-2",
    routeId: "route-1",
    stationId: STATIONS_MOCK[1].id,
    order: 2,
    durationFromStart: 180,
    distanceFromStart: 150,
    priceFromStart: 200000,
    station: STATIONS_MOCK[1],
  },
  {
    id: "rs-3",
    routeId: "route-1",
    stationId: STATIONS_MOCK[2].id,
    order: 3,
    durationFromStart: 360,
    distanceFromStart: 300,
    priceFromStart: 350000,
    station: STATIONS_MOCK[2],
  },
];

export const ROUTES_MOCK: Route[] = [
  {
    id: "route-1",
    name: "Hà Nội → Nghệ An",
    stops: routeStations,
  },
];
