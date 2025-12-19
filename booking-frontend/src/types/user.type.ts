import type { Booking } from './booking.type'
import type { UserRole } from './enum'

export interface User {
    id: string
    email: string
    name: string
    phone: string
    role: UserRole | string
    createdAt: string // ISO Date String
    updatedAt: string // ISO Date String

    // Relations (Optional)
    bookings?: Booking[]
}
