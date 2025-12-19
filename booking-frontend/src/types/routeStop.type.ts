import type { Route } from "./route.type"
import type { Station } from "./station.type"

export interface RouteStop {
    id: string
    routeId: string
    stationId: string
    order: number

    durationFromStart: number // Phút
    distanceFromStart: number // Km
    priceFromStart: number // Decimal trong DB trả về number hoặc string ở FE

    // Relations
    route?: Route
    station?: Station
}
