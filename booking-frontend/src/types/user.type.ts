import type { Booking } from './booking.type'
import type { Role } from './enum'

export interface User {
    id: string
    email: string
    name: string
    passwordHash: string // Lưu ý: Thường không trả về passwordHash cho frontend
    phone: string
    role: Role
    currentHashedRefreshToken?: string | null

    createdAt: string // ISO Date String
    updatedAt: string // ISO Date String

    // Relations
    bookings?: Booking[]
}
