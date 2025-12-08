import type { Booking } from "./booking.type"
import type { Seat } from "./seat.type"
import type { Trip } from "./trip.type"

export interface Ticket {
    id: string
    bookingId: string
    tripId: string
    seatId: string
    price: number // Giá vé tại thời điểm đặt

    // Relations (Optional)
    booking?: Booking
    seat?: Seat
    trip?: Trip
}
