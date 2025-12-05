// Định nghĩa Status chung cho API
export type ApiStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
}

export const SeatType = {
    SEAT: 'SEAT',
    SINGLE_BED: 'SINGLE_BED',
    DOUBLE_BED: 'DOUBLE_BED',
} as const

export type SeatType = (typeof SeatType)[keyof typeof SeatType]

export const BookingStatus = {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    CANCELLED: 'CANCELLED',
} as const

export type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus]
