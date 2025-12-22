export interface TripInTripList {
    /** ID duy nhất của chuyến đi (UUID) */
    id: string

    /** Tên nhà xe (VD: Phương Trang Limousine) */
    busName: string

    /** Biển số xe */
    plateNumber: string

    /** Tổng số ghế trên xe */
    totalSeats: number

    /** ID của tuyến đường */
    routeId: string

    /** Điểm xuất phát */
    fromStation: string
    fromProvince: string

    /** Điểm đến */
    toStation: string
    toProvince: string

    /** Thời gian đón (định dạng ISO 8601 string) */
    pickupTime: string

    /** Thời gian đến (định dạng ISO 8601 string) */
    arrivalTime: string

    /** Thời gian di chuyển (tính bằng phút) */
    duration: number

    /** Giá vé (VND) */
    price: number
}
