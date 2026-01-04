import { useState, useEffect, useRef } from 'react'
import {
    Bus as BusIcon,
    Copy,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowLeft,
    ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import QRCodeComponent from '@/components/Payment/QrCode'
import bookingService from '@/services/bookingService'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import paymentService from '@/services/paymentService'
import type { ZaloPayOrderResponse } from '@/types/zalopayOrderResponse'

interface BookingPayment {
    id: string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
    totalAmount: string
    expiredAt: string
    paymentRef: string | null
    user: {
        name: string
        email: string
        phone: string
    }
    trip: {
        departureTime: string
        bus: { name: string; plateNumber: string }
        route: { name: string }
    }
    departureStation: {
        name: string
        address: string
        durationFromStart?: number
    }
    arrivalStation: { name: string; address: string }
    tickets: Array<{
        id: string
        seat: { label: string; type: string }
    }>
}

const getRealDepartureTime = (
    tripStartTime: string,
    durationMinutes: number = 0,
) => {
    const date = new Date(tripStartTime)
    // Cộng thêm số phút di chuyển từ điểm đầu đến trạm đón
    date.setMinutes(date.getMinutes() + durationMinutes)
    return date.toISOString()
}

export default function PaymentPage() {
    const { bookingId } = useParams()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [booking, setBooking] = useState<BookingPayment | null>(null)
    const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 })
    const [isTimeOver, setIsTimeOver] = useState(false)

    // STATE: Lưu link thanh toán từ ZaloPay
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
    const [isCreatingPayment, setIsCreatingPayment] = useState(false)
    const hasCreatedPayment = useRef(false) // Tránh gọi API 2 lần

    const checkExpiration = (expiredAtString: string) => {
        const now = new Date().getTime()
        const expiredTime = new Date(expiredAtString).getTime()
        const distance = expiredTime - now

        if (distance <= 0) {
            setIsTimeOver(true)
            setTimeLeft({ minutes: 0, seconds: 0 })
            return true // Đã hết thời gian
        } else {
            setIsTimeOver(false)
            setTimeLeft({
                minutes: Math.floor(
                    (distance % (1000 * 60 * 60)) / (1000 * 60),
                ),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            })
            return false // Còn hạn
        }
    }

    const handleCreatePayment = async (currentBookingId: string) => {
        if (hasCreatedPayment.current) return // Đã gọi rồi thì thôi

        try {
            setIsCreatingPayment(true)
            hasCreatedPayment.current = true // Mark as called

            const res = await paymentService.createZaloPayUrl(currentBookingId)

            const zpData = res.data.data as ZaloPayOrderResponse

            if (zpData.return_code === 1 && zpData.order_url) {
                setPaymentUrl(zpData.order_url)
            } else {
                toast.error(
                    zpData.return_message || 'Không lấy được link thanh toán',
                )
                hasCreatedPayment.current = false // Reset để cho phép thử lại nếu lỗi
            }
        } catch (error: any) {
            console.error('Lỗi tạo thanh toán:', error)
            toast.error(
                error.response?.data?.message || 'Lỗi khởi tạo thanh toán',
            )
            hasCreatedPayment.current = false // Reset nếu lỗi mạng
        } finally {
            setIsCreatingPayment(false)
        }
    }

    // --- POLLING CHECKING ---
    useEffect(() => {
        let interval: any

        // Chỉ chạy khi có booking, đang PENDING và chưa hết giờ
        if (booking && booking.status === 'PENDING' && !isTimeOver) {
            interval = setInterval(async () => {
                try {
                    // Gọi lại API getById để lấy trạng thái mới nhất
                    const res = await bookingService.getById(booking.id)
                    const data = res.data

                    // Nếu trạng thái đã đổi sang CONFIRMED
                    if (data.status === 'CONFIRMED') {
                        setBooking(data) // Cập nhật state để UI tự đổi sang Success
                        toast.success(
                            `Thanh toán thành công số tiền ${formatCurrency(
                                booking.totalAmount,
                            )}!`,
                        )
                        clearInterval(interval) // Dừng check
                    }

                    // Nếu bị hủy
                    if (data.status === 'CANCELLED') {
                        setBooking(data)
                        clearInterval(interval)
                    }
                } catch (error) {
                    console.error('Lỗi khi auto-check:', error)
                }
            }, 5000) // 5 giây check 1 lần
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [booking, isTimeOver]) // Dependency quan trọng

    // --- FETCH BOOKING DATA ---
    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return

            setLoading(true)

            try {
                const response = await bookingService.getById(bookingId)
                if (response && response.data) {
                    const data = response.data

                    // CASE A: Đã thanh toán thành công -> Chuyển sang trang xem vé/kết quả
                    if (data.status === 'CONFIRMED') {
                        toast.success(
                            'Đơn hàng này đã thanh toán xong. Đang chuyển hướng...',
                        )
                        navigate('/')
                        return
                    }

                    // CASE B: Đã hủy -> Về trang chủ
                    if (data.status === 'CANCELLED') {
                        toast.error('Đơn hàng này đã bị hủy.')
                        navigate('/')
                        return
                    }

                    // CASE C: Trạng thái PENDING nhưng ĐÃ HẾT GIỜ -> Về trang chủ
                    if (
                        data.status === 'PENDING' &&
                        checkExpiration(data.expiredAt)
                    ) {
                        toast.error(
                            'Đơn hàng đã hết thời gian giữ vé. Vui lòng đặt lại.',
                        )
                        navigate('/schedule')
                        return
                    }

                    // --- NẾU HỢP LỆ THÌ MỚI SET STATE ĐỂ HIỂN THỊ ---
                    setBooking(data)

                    if (
                        data.status === 'PENDING' &&
                        !checkExpiration(data.expiredAt)
                    ) {
                        handleCreatePayment(data.id)
                    }
                }
            } catch (error) {
                console.error('Lỗi:', error)
                navigate('/')
            } finally {
                setLoading(false)
            }
        }

        fetchBooking()
    }, [bookingId])

    // --- COUNTDOWN TIMER ---
    useEffect(() => {
        if (!booking) return

        // Chỉ chạy đồng hồ nếu đang PENDING
        if (booking.status === 'PENDING') {
            const timer = setInterval(() => {
                const isExpired = checkExpiration(booking.expiredAt)
                if (isExpired) {
                    clearInterval(timer) // Dừng timer nếu hết giờ
                }
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [booking])

    // --- LOGIC PHÂN LOẠI UI ---

    // Case 1: Cho phép thanh toán (Status PENDING + Còn thời gian)
    const showPaymentUI = booking?.status === 'PENDING' && !isTimeOver
    // Case 2: Hết hạn (Status PENDING + Hết thời gian)
    const showExpiredUI = booking?.status === 'PENDING' && isTimeOver
    // Case 3: Đã hủy (Status CANCELLED)
    const showCancelledUI = booking?.status === 'CANCELLED'
    // Case 4: Thành công (Status CONFIRMED)
    const showSuccessUI = booking?.status === 'CONFIRMED'

    // Utils
    const formatCurrency = (val: string) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(Number(val))
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert(`Đã sao chép: ${text}`)
    }

    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    if (loading || !booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
                Đang tải...
            </div>
        )
    }

    const realDepartureTime = getRealDepartureTime(
        booking.trip.departureTime,
        booking.departureStation.durationFromStart || 0,
    )

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        className="pl-0 hover:bg-transparent"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
                    </Button>
                    <h1 className="text-3xl font-bold mt-2">Thanh Toán</h1>
                    <p className="text-slate-500">
                        Mã đơn: <span className="font-mono">{booking.id}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* --- CỘT TRÁI: THÔNG TIN --- */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* 1. HIỂN THỊ CẢNH BÁO TRẠNG THÁI */}
                        {showPaymentUI && (
                            <Card className="border-l-4 border-l-orange-500 bg-orange-50/50 shadow-sm">
                                <CardContent className="p-6 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-6 w-6 text-orange-600 animate-pulse" />
                                        <div>
                                            <p className="font-bold text-orange-900">
                                                Giữ vé trong
                                            </p>
                                            <p className="text-xs text-orange-700">
                                                Vui lòng thanh toán trước khi
                                                hết giờ
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-3xl font-mono font-bold text-orange-600 tabular-nums">
                                        {String(timeLeft.minutes).padStart(
                                            2,
                                            '0',
                                        )}
                                        :
                                        {String(timeLeft.seconds).padStart(
                                            2,
                                            '0',
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {showExpiredUI && (
                            <Card className="border-l-4 border-l-red-500 bg-red-50/50 shadow-sm">
                                <CardContent className="p-6 flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-red-600" />
                                    <div>
                                        <p className="font-bold text-red-900">
                                            Đơn hàng đã quá hạn thanh toán
                                        </p>
                                        <p className="text-sm text-red-700">
                                            Thời gian giữ vé đã kết thúc. Vui
                                            lòng đặt lại vé mới.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {showCancelledUI && (
                            <Card className="border-l-4 border-l-slate-500 bg-slate-100 shadow-sm">
                                <CardContent className="p-6 flex items-center gap-3">
                                    <XCircle className="h-6 w-6 text-slate-600" />
                                    <div>
                                        <p className="font-bold text-slate-900">
                                            Đơn hàng đã bị hủy
                                        </p>
                                        <p className="text-sm text-slate-700">
                                            Đơn hàng này đã bị hủy bỏ.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {showSuccessUI && (
                            <Card className="border-l-4 border-l-green-500 bg-green-50/50 shadow-sm">
                                <CardContent className="p-6 flex items-center gap-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    <div>
                                        <p className="font-bold text-green-900">
                                            Thanh toán thành công
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* 2. THÔNG TIN CHUYẾN ĐI */}
                        <Card className="shadow-sm">
                            <CardHeader className="pb-3 border-b bg-white">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <BusIcon className="h-5 w-5 text-blue-600" />{' '}
                                    Thông Tin Chuyến Đi
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex justify-between">
                                    <div className="font-bold text-lg text-blue-900">
                                        {booking.trip.route.name}
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xl font-bold text-blue-600">
                                            {formatTime(realDepartureTime)}
                                        </div>
                                        <div className="text-sm font-medium text-slate-500">
                                            {formatDate(realDepartureTime)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-sm text-slate-500">
                                    <Badge variant="outline">
                                        {booking.trip.bus.name}
                                    </Badge>
                                    <Badge variant="outline">
                                        {booking.trip.bus.plateNumber}
                                    </Badge>
                                </div>
                                <div className="space-y-4 border-l-2 border-slate-200 ml-2 pl-4 py-2">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500">
                                            ĐIỂM ĐÓN
                                        </p>
                                        <p className="font-medium">
                                            {booking.departureStation.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-500">
                                            ĐIỂM TRẢ
                                        </p>
                                        <p className="font-medium">
                                            {booking.arrivalStation.name}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. THÔNG TIN KHÁCH */}
                        <Card className="shadow-sm">
                            <CardContent className="pt-6 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Họ tên
                                    </p>
                                    <p className="font-medium">
                                        {booking.user.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">
                                        SĐT
                                    </p>
                                    <p className="font-medium">
                                        {booking.user.phone}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-500 mb-1">
                                        Ghế
                                    </p>
                                    <div className="flex gap-2">
                                        {booking.tickets.map((t) => (
                                            <Badge
                                                key={t.id}
                                                className="bg-blue-50 text-blue-700 border-blue-200"
                                            >
                                                {t.seat.label} ({t.seat.type})
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- CỘT PHẢI: ACTIONS --- */}
                    <div className="lg:col-span-5">
                        {showPaymentUI && (
                            <Card className="shadow-lg border-t-4 border-t-blue-600 sticky top-4">
                                <CardHeader>
                                    <CardTitle className="text-center">
                                        Quét mã thanh toán ZaloPay
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-4">
                                    {/* KHUNG QR CODE */}
                                    <div className="bg-white p-2 rounded-xl border shadow-sm relative">
                                        {isCreatingPayment ? (
                                            <div className="h-[180px] w-[180px] flex items-center justify-center bg-slate-100 rounded text-xs text-slate-500 text-center px-2">
                                                Đang tạo mã QR...
                                            </div>
                                        ) : paymentUrl ? (
                                            // UPDATE: QRCode bây giờ hiển thị link thanh toán của ZaloPay
                                            <QRCodeComponent
                                                value={paymentUrl}
                                                size={180}
                                            />
                                        ) : (
                                            <div className="h-[180px] w-[180px] flex items-center justify-center bg-slate-100 rounded text-red-500 text-xs text-center px-2">
                                                Không tải được mã. <br /> Vui
                                                lòng tải lại trang.
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-500 text-center">
                                        Mở ứng dụng <b>ZaloPay</b> hoặc{' '}
                                        <b>Zalo</b> <br /> để quét mã
                                    </p>

                                    {/* NÚT THANH TOÁN CHO MOBILE */}
                                    {paymentUrl && (
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2"
                                            onClick={() =>
                                                (window.location.href =
                                                    paymentUrl)
                                            }
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Mở app ZaloPay ngay
                                        </Button>
                                    )}

                                    <div className="w-full bg-slate-50 p-3 rounded border flex justify-between items-center mt-2">
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Mã đơn hàng
                                            </p>
                                            <p className="font-mono font-bold text-sm">
                                                {booking.id
                                                    .slice(0, 8)
                                                    .toUpperCase()}
                                                ...
                                            </p>
                                        </div>
                                        {/* Giữ lại nút copy booking ID phòng khi cần hỗ trợ */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                copyToClipboard(booking.id)
                                            }
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="text-center w-full pt-2 border-t">
                                        <p className="text-sm text-slate-500">
                                            Tổng thanh toán
                                        </p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {formatCurrency(
                                                booking.totalAmount,
                                            )}
                                        </p>
                                    </div>

                                    <p className="text-xs text-center text-slate-400">
                                        Hệ thống sẽ tự động cập nhật trạng thái
                                        sau khi bạn thanh toán thành công trên
                                        App.
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* CASE B: KHÔNG THỂ THANH TOÁN (Hết hạn / Hủy / Đã xong) */}
                        {!showPaymentUI && (
                            <Card className="shadow-md bg-slate-50 sticky top-4">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center gap-4">
                                    {showSuccessUI ? (
                                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                        </div>
                                    ) : (
                                        <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center">
                                            <XCircle className="h-8 w-8 text-slate-500" />
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="font-bold text-lg">
                                            {showSuccessUI
                                                ? 'Đã thanh toán xong'
                                                : 'Không thể thanh toán'}
                                        </h3>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {showSuccessUI
                                                ? 'Cảm ơn bạn đã tin tưởng sử dụng dịch vụ.'
                                                : showExpiredUI
                                                ? 'Đơn hàng này đã hết thời gian giữ vé.'
                                                : 'Đơn hàng này không khả dụng.'}
                                        </p>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => navigate('/schedule')}
                                    >
                                        {showSuccessUI
                                            ? 'Về trang chủ'
                                            : 'Tìm chuyến xe khác'}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
