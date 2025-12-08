export type SeatStatus = 'AVAILABLE' | 'RESERVED' | 'PENDING'
export type SeatType = 'SEAT' | 'SINGLE_BED' | 'DOUBLE_BED'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type UserRole = 'user' | 'admin' | 'driver'

/**
 * Model SeatLock (Khóa ghế tạm thời)
 */
export interface SeatLock {
    id: string
    seatId: string
    userId: string | null // Null nếu là khách vãng lai
    expiresAt: string // ISO Date String
    createdAt: string
}

// =========================================
// 3. UTILITY TYPES (Kiểu dữ liệu hỗ trợ API)
// =========================================

// Wrapper cho phản hồi API
export interface ApiResponse<T> {
    status: number // HTTP Status code
    message: string
    data: T // Dữ liệu chính
    pagination?: {
        // Nếu có phân trang
        page: number
        limit: number
        totalItems: number
        totalPages: number
    }
}