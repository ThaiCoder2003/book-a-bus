import type { Booking } from './booking.type'
import type { Bus } from './bus.type'
import type { Station } from './station.type'
import type { Ticket } from './ticket.type'

export interface Trip {
    id: string
    busId: string
    originStationId: string
    destStationId: string

    departureTime: string // ISO Date String
    arrivalTime: string | null // Có thể null

    basePrice: number // Decimal trong DB -> Number trong JS

    // Relations (Optional)
    originStation?: Station
    destStation?: Station
    bus?: Bus
    bookings?: Booking[]
    tickets?: Ticket[]

    hoursTime: number
    minutesTime: number
}
