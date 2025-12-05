// Chỉ chứa thông tin thuần của User, KHÔNG có quan hệ
export interface UserBase {
    id: string
    email: string
    name: string
    role: string
}

// Chỉ chứa thông tin thuần của Booking, KHÔNG có quan hệ
export interface BookingBase {
    id: string
    tripId: string
    totalAmount: number
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' // Đã fix enum
    createdAt: string
}

// Chỉ chứa thông tin thuần của Trip
export interface TripBase {
    id: string
    departureTime: string
    basePrice: number
}
