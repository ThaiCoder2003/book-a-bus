import { Bus, Calendar, Clock, MapPin, QrCode, X, Ticket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

interface NextTripCardProps {
    booking: {
        ticketCode: string
        departureProvince: string
        departureStation: string
        arrivalProvince: string
        arrivalStation: string
        time: string
        date: string
        busPlate: string
        busType: string
        seatNumber: string
        bookingId: string
        duration?: string
    } | null
}

export default function NextTripCard({ booking }: NextTripCardProps) {
    if (!booking) {
        return (
            <Card className="w-full border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Bus className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Bạn chưa có chuyến đi nào
                    </h3>
                    <p className="text-sm text-slate-500 max-w-[250px] mt-1">
                        Hãy chọn cho mình một hành trình mới cùng chúng tôi ngay
                        hôm nay!
                    </p>
                    <Link to="/schedule">
                        <Button className="mt-6 bg-primary" variant="default">
                            Đặt vé ngay
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full overflow-hidden border-l-4 border-l-primary shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 bg-muted/30">
                <div className="flex items-center gap-2">
                    <Badge
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Sắp khởi hành
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        Mã vé: {booking?.ticketCode}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer text-muted-foreground hover:text-destructive"
                >
                    <X className="mr-1 h-4 w-4" />
                    Hủy vé
                </Button>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    {/* Route Info */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between md:justify-start md:gap-12">
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-bold text-primary">
                                    {booking?.arrivalProvince}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />{' '}
                                    {booking?.arrivalStation}
                                </p>
                            </div>

                            <div className="flex flex-col items-center px-4">
                                <span className="text-xs text-muted-foreground mb-1">
                                    {booking?.duration}
                                </span>
                                <div className="flex items-center text-muted-foreground">
                                    <div className="h-[2px] w-12 bg-border relative">
                                        <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                                        <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <Bus className="mx-2 h-5 w-5 text-primary" />
                                    <div className="h-[2px] w-12 bg-border relative">
                                        <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                                        <div className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                </div>
                                <span className="text-xs text-primary font-medium mt-1">
                                    {booking?.busType}
                                </span>
                            </div>

                            <div className="text-center md:text-right">
                                <p className="text-2xl font-bold text-primary">
                                    {booking?.departureProvince}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-end gap-1 mt-1">
                                    <MapPin className="h-3 w-3" />{' '}
                                    {booking?.departureStation}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-full shadow-sm">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Giờ khởi hành
                                    </p>
                                    <p className="font-semibold">
                                        {booking?.time}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-full shadow-sm">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Ngày đi
                                    </p>
                                    <p className="font-semibold">
                                        {booking?.date}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-full shadow-sm">
                                    <Bus className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Biển số xe
                                    </p>
                                    <p className="font-semibold">
                                        {booking?.busPlate}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-full shadow-sm">
                                    <Ticket className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Số ghế
                                    </p>
                                    <p className="font-semibold text-orange-600">
                                        {booking?.seatNumber}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
                        <div className="bg-white p-2 rounded-lg border shadow-sm mb-3">
                            <QrCode className="h-32 w-32 text-foreground" />
                        </div>
                        <Button
                            className="cursor-pointer w-full bg-transparent"
                            variant="outline"
                        >
                            <QrCode className="mr-2 h-4 w-4" />
                            Hiện mã vé
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
