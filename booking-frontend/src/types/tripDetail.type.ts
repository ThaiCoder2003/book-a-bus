export interface RoutePoint {
    stationId: string
    stationName: string
    address: string
    order: number
    priceFromStart: 0
    arrivalTimeISO: string
}

export interface TripDetail {
    tripId: string
    busName: string
    plateNumber: string
    totalSeats: number
    routePoints: RoutePoint[]
}
