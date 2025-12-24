import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MapPin, Clock, ArrowRight, Bus, Armchair } from 'lucide-react'
import { format, differenceInMinutes } from 'date-fns' // Khuyên dùng date-fns để xử lý ngày tháng dễ hơn
import { vi } from 'date-fns/locale'
import convertAction from '@/actions/convertAction'
import type { TripDetail } from '@/types/tripDetail.type'

export function TripInfo({ trip }: { trip: TripDetail }) {
    // 2. Xử lý dữ liệu từ mảng routePoints
    // Sắp xếp lại theo order để đảm bảo tính đúng đắn
    const sortedPoints = [...trip.routePoints].sort((a, b) => a.order - b.order)

    if (sortedPoints.length === 0)
        return <div>Thông tin chuyến đi chưa cập nhật</div>

    const startPoint = sortedPoints[0]
    const endPoint = sortedPoints[sortedPoints.length - 1]

    // Parse thời gian
    const startTime = new Date(startPoint.arrivalTimeISO)
    const endTime = new Date(endPoint.arrivalTimeISO)

    // Tính thời gian di chuyển
    const totalMinutes = differenceInMinutes(endTime, startTime)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const durationString = minutes > 0 ? `${hours}h ${minutes}p` : `${hours}h`

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            <Bus className="h-5 w-5 text-primary" />
                            {trip.busName}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary" className="font-normal">
                                <Armchair className="h-3 w-3 mr-1" />
                                {trip.totalSeats} chỗ
                            </Badge>
                        </CardDescription>
                    </div>
                    <Badge
                        variant="outline"
                        className="text-base font-semibold px-3 py-1 border-primary/50 text-primary"
                    >
                        {trip.plateNumber}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Điểm đi */}
                    <div className="flex-1">
                        <p className="text-2xl font-bold text-primary">
                            {format(startTime, 'HH:mm')}
                        </p>
                        <div className="flex items-center gap-1 text-sm font-medium mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span
                                // className="truncate max-w-[120px]"
                                title={startPoint.stationName}
                            >
                                {startPoint.stationName}
                            </span>
                        </div>
                    </div>

                    {/* Mũi tên & Thời lượng */}
                    <div className="flex flex-col items-center px-2">
                        <span className="text-xs text-muted-foreground mb-1">
                            {durationString}
                        </span>
                        <div className="flex items-center text-muted-foreground/50">
                            <div className="h-0.5 w-8 bg-current"></div>
                            <ArrowRight className="h-4 w-4 text-primary -mx-0.5" />
                            <div className="h-0.5 w-2 bg-current"></div>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                            {format(startTime, 'dd/MM', { locale: vi })}
                        </span>
                    </div>

                    {/* Điểm đến */}
                    <div className="flex-1 text-right">
                        <p className="text-2xl font-bold text-primary">
                            {format(endTime, 'HH:mm')}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-sm font-medium mt-1">
                            <span
                                // className="truncate max-w-[120px]"
                                title={endPoint.stationName}
                            >
                                {endPoint.stationName}
                            </span>
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Chi tiết hành trình */}
                <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Lộ trình chi tiết
                    </h4>
                    <ScrollArea className="h-[238px] pr-4">
                        <div className="relative pl-2 border-l-2 border-muted ml-2 space-y-6 pb-2">
                            {sortedPoints.map((point, index) => {
                                const isStart = index === 0
                                const isEnd = index === sortedPoints.length - 1
                                const pointTime = new Date(point.arrivalTimeISO)

                                return (
                                    <div
                                        key={point.stationId}
                                        className="relative pl-6"
                                    >
                                        {/* Dấu chấm trên timeline */}
                                        <div
                                            className={`absolute left-[-5px] top-1 h-3 w-3 rounded-full border-2 border-background 
                                            ${
                                                isStart || isEnd
                                                    ? 'bg-primary ring-2 ring-primary/20'
                                                    : 'bg-muted-foreground'
                                            }`}
                                        />

                                        <div className="grid grid-cols-[60px_1fr] gap-2">
                                            {/* Giờ */}
                                            <div className="text-sm font-semibold text-muted-foreground pt-0.5">
                                                {format(pointTime, 'HH:mm')}
                                            </div>

                                            {/* Thông tin trạm */}
                                            <div>
                                                <p
                                                    className={`text-sm ${
                                                        isStart || isEnd
                                                            ? 'font-bold text-foreground'
                                                            : 'font-medium'
                                                    }`}
                                                >
                                                    {point.stationName}
                                                </p>
                                                <p
                                                    className="text-xs text-muted-foreground truncate"
                                                    title={point.address}
                                                >
                                                    {point.address}
                                                </p>
                                                {/* Hiển thị giá vé lũy kế nếu cần */}
                                                {point.priceFromStart > 0 && (
                                                    <Badge
                                                        variant="outline"
                                                        className="mt-1 text-[10px] h-5 px-1.5 font-normal"
                                                    >
                                                        +
                                                        {convertAction.formatCurrency(
                                                            Number(
                                                                point.priceFromStart,
                                                            ),
                                                        )}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}

export default TripInfo
