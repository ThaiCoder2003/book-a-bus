import type { BookingBase, UserBase, TripBase } from './base.type'

// Booking chi tiết bao gồm thông tin User và Trip
export interface BookingDetail extends BookingBase {
    user: UserBase // Chỉ lấy thông tin cơ bản của user
    trip: TripBase
}
