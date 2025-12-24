import type { Route } from "./route.type"
import type { Station } from "./station.type"

export interface RouteStation {
    id: string
    routeId: string
    stationId: string
    order: number

    durationFromStart: number // đơn vị: phút
    distanceFromStart: number // đơn vị: km

    priceFromStart: number

    // Relations (Optional - vì có thể bạn không include khi query)
    station?: Station
    route?: Route // Định nghĩa interface Route nếu cần
}
