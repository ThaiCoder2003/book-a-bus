import type { Bus } from './bus.type'
import type { Route } from './route.type'
import type { Booking } from './booking.type'
import type { Ticket } from './ticket.type'

export interface Trip {
    id: string
    busId: string
    routeId: string
    departureTime: string // ISO Date String

    // Relations
    bus?: Bus
    route?: Route
    bookings?: Booking[]
    tickets?: Ticket[]
}
