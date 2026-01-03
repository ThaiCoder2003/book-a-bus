import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import type { TripDetail } from '@/types/tripDetail.type'
import type { Seat } from '@/types/seat.type'
import bookingService from '@/services/bookingService'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import authAction from '@/actions/authAction'

const SEAT_MULTIPLIERS = {
    SEAT: 1,
    VIP: 1.25,
    SINGLE_BED: 1.75,
    DOUBLE_BED: 2.75,
}

export function BookingSummary({
    trip,
    fromTo,
    basePrice,
    selectedSeatList,
    onBookingError,
}: {
    trip: TripDetail
    fromTo: {
        from: number
        to: number
    }
    basePrice: number
    selectedSeatList: Seat[]
    onBookingError: () => void
}) {
    const totalPrice = selectedSeatList.reduce((total, seat) => {
        const coef = SEAT_MULTIPLIERS[seat.type] || 1
        return total + basePrice * coef
    }, 0)

    const navigate = useNavigate()
    const location = useLocation();

    const handleOnClickContinue = async () => {
        const payload = {
            tripId: trip.tripId,
            seatIds: selectedSeatList.map((seat) => seat.id),
            fromOrder: fromTo.from,
            toOrder: fromTo.to,
            depStationId: trip.routePoints[fromTo.from].stationId,
            arrStationId: trip.routePoints[fromTo.to].stationId,
        }

        try {
            const accessToken = await authAction.getToken()

            // --- KIỂM TRA ĐĂNG NHẬP ---
            const handleUnauthorized = () => {
                sessionStorage.setItem(
                    'pendingBooking',
                    JSON.stringify(payload),
                )

                // Chuyển hướng
                navigate('/auth', {
                    state: { from: location },
                    replace: true,
                })
            }

            if (!accessToken) {
                handleUnauthorized()
                return
            }

            const decoded = await authAction.decodeToken(accessToken)

            // Nếu decode ra null hoặc không có userId (token bị lỗi/hết hạn)
            if (!decoded || !decoded.userId) {
                await authAction.clearToken()
                handleUnauthorized()
                return
            }

            // --- TIẾN HÀNH TẠO BOOKING ---
            const response = await bookingService.create(payload)

            if (response?.data?.success) {
                // Điều hướng đến trang thanh toán
                const booking = response.data.booking
                navigate(`/payment/${booking.id}`)
            }
        } catch (error: any) {
            if (error.response) {
                const serverMessage = error.response.data.message
                toast.error(serverMessage || 'Có lỗi xảy ra, vui lòng thử lại')
                onBookingError()
            } else {
                toast.error('Lỗi kết nối máy chủ')
            }


        }
    }

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle>Thông tin đặt vé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Selected Seats */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Ghế đã chọn</span>
                        <Badge
                            variant={
                                selectedSeatList.length > 0
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {selectedSeatList.length} ghế
                        </Badge>
                    </div>
                    {selectedSeatList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedSeatList.map((seat) => (
                                <Badge
                                    key={seat.id}
                                    variant="outline"
                                    className="text-base font-semibold"
                                >
                                    {seat.label}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Chưa chọn ghế nào
                        </p>
                    )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Giá vé ({selectedSeatList.length} ghế)
                        </span>
                        <span className="font-medium">
                            {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Phí dịch vụ
                        </span>
                        <span className="font-medium">0đ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="font-semibold">Tổng cộng</span>
                        <span className="text-xl font-bold text-primary">
                            {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleOnClickContinue}
                        disabled={selectedSeatList.length === 0}
                    >
                        <User className="mr-2 h-4 w-4" />
                        Tiếp tục đặt vé
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Bằng việc tiếp tục, bạn đồng ý với điều khoản sử dụng
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default BookingSummary
