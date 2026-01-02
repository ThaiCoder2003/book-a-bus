import { useState, useEffect } from 'react'
import { Clock, MapPin, AlertCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import QRCodeComponent from '@/components/Payment/QrCode'

interface PaymentData {
    id: string
    customerName: string
    customerPhone: string
    departureStation: string
    arrivalStation: string
    departureTime: string
    departureDate: string
    totalAmount: number
    currency: string
    expiresAt: Date
}

export default function PaymentPage() {
    const [timeLeft, setTimeLeft] = useState<{
        minutes: number
        seconds: number
    }>({ minutes: 15, seconds: 0 })

    const [paymentData] = useState<PaymentData>({
        id: 'TICKET-2026-001',
        customerName: 'Nguyễn Văn A',
        customerPhone: '+84 912 345 678',
        departureStation: 'Bến xe Nước Ngầm - Hà Nội',
        arrivalStation: 'Bến xe Mỹ Đình - Hà Nội',
        departureTime: '14:30',
        departureDate: '15/01/2026',
        totalAmount: 85000,
        currency: 'VNĐ',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds === 0) {
                    if (prev.minutes === 0) {
                        clearInterval(timer)
                        return { minutes: 0, seconds: 0 }
                    }
                    return { minutes: prev.minutes - 1, seconds: 59 }
                }
                return { minutes: prev.minutes, seconds: prev.seconds - 1 }
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const isExpired = timeLeft.minutes === 0 && timeLeft.seconds === 0

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                        Thanh Toán Vé Xe
                    </h1>
                    <p className="text-slate-600">
                        Vui lòng thanh toán trong thời gian quy định
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Expiration Timer Card */}
                        <Card className="border-2 border-red-200 bg-red-50 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <h2 className="text-lg font-semibold text-red-900">
                                    Thời hạn thanh toán
                                </h2>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-slate-700">Hết hạn trong:</p>
                                <div
                                    className={`text-4xl font-bold font-mono ${
                                        isExpired
                                            ? 'text-red-600'
                                            : 'text-blue-600'
                                    }`}
                                >
                                    {String(timeLeft.minutes).padStart(2, '0')}:
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </div>
                            </div>
                        </Card>

                        {/* Trip Details Card */}
                        <Card className="p-6 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">
                                Thông Tin Chuyến Đi
                            </h2>

                            <div className="space-y-6">
                                {/* Route */}
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                                        <div className="w-1 h-16 bg-blue-300" />
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-sm font-medium text-slate-500 mb-1">
                                            Điểm xuất phát
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900 mb-8">
                                            {paymentData.departureStation}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500 mb-1">
                                            Điểm đến
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {paymentData.arrivalStation}
                                        </p>
                                    </div>
                                </div>

                                {/* Time & Date */}
                                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500 mb-2">
                                            Ngày khởi hành
                                        </p>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {paymentData.departureDate}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                                            <Clock className="w-4 h-4" />
                                            Giờ khởi hành
                                        </div>
                                        <p className="text-lg font-semibold text-slate-900">
                                            {paymentData.departureTime}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Customer Info Card */}
                        <Card className="p-6 shadow-md">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">
                                Thông Tin Khách Hàng
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">
                                        Họ và tên
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {paymentData.customerName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">
                                        Số điện thoại
                                    </p>
                                    <p className="text-base font-semibold text-slate-900">
                                        {paymentData.customerPhone}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">
                                        Mã vé
                                    </p>
                                    <p className="text-base font-mono font-semibold text-blue-600">
                                        {paymentData.id}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-6">
                        {/* QR Code Card */}
                        <Card className="p-6 shadow-md flex flex-col items-center bg-white top-6">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">
                                Mã QR Thanh Toán
                            </h3>
                            <QRCodeComponent value={paymentData.id} />
                            <p className="text-xs text-slate-500 text-center mt-4">
                                Quét mã QR để thanh toán
                            </p>
                        </Card>

                        {/* Total Card */}
                        <Card className="p-6 shadow-lg border-2 border-blue-600 bg-linear-to-br from-blue-50 to-blue-100">
                            <p className="text-sm font-medium text-slate-600 mb-2">
                                Tổng tiền
                            </p>
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-blue-600">
                                    {paymentData.totalAmount.toLocaleString(
                                        'vi-VN',
                                    )}
                                </span>
                                <span className="text-lg font-semibold text-slate-700 ml-2">
                                    {paymentData.currency}
                                </span>
                            </div>

                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                                disabled={isExpired}
                            >
                                {isExpired
                                    ? 'Hết hạn thanh toán'
                                    : 'Xác Nhận Thanh Toán'}
                            </Button>

                            <p className="text-xs text-slate-600 text-center mt-3">
                                Nhấn nút để hoàn tất giao dịch
                            </p>
                        </Card>

                        {/* Info Card */}
                        <Card className="p-4 bg-slate-50 border-0">
                            <p className="text-xs leading-relaxed text-slate-600">
                                <span className="font-semibold text-slate-900">
                                    Lưu ý:
                                </span>{' '}
                                Vé sẽ được gửi qua email sau khi thanh toán
                                thành công. Vui lòng giữ mã vé để lên xe.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
