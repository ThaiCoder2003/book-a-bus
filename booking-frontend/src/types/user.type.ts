import type { UserBase, BookingBase } from './base.type'

// User đầy đủ bao gồm danh sách booking
export interface UserProfile extends UserBase {
    bookings: BookingBase[] // Chỉ lấy thông tin cơ bản của booking
}
