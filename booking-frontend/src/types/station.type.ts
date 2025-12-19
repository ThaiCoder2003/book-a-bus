import type { Booking } from './booking.type'
import type { RouteStop } from './routeStop.type'

export interface Station {
    id: string
    name: string
    address: string
    province: string

    // Relations
    bookingDepartures?: Booking[]
    bookingArrivals?: Booking[]
    routeStops?: RouteStop[]
}
