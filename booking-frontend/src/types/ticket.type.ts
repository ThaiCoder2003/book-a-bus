import type { Booking } from './booking.type'
import type { Seat } from './seat.type'
import type { Trip } from './trip.type'

export interface Ticket {
    id: string
    bookingId: string
    seatId: string
    tripId: string

    // Denormalization fields
    fromOrder: number
    toOrder: number

    // Relations
    booking?: Booking
    seat?: Seat
    trip?: Trip
}
