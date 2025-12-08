import type { BookingStatus } from "./enum"
import type { Ticket } from "./ticket.type"
import type { Trip } from "./trip.type"
import type { User } from "./user.type"

export interface Booking {
    id: string
    tripId: string
    userId: string

    // Thông tin người đi (có thể khác người đặt)
    userName: string
    userPhone: string

    totalAmount: number // Decimal -> Number
    status: BookingStatus
    createdAt: string // ISO Date String

    // Relations (Optional)
    user?: User
    trip?: Trip
    tickets?: Ticket[]
}
