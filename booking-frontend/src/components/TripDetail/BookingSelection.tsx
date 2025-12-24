import { useState, useMemo } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card' // Bỏ Header/Footer thừa
import { Button } from '@/components/ui/button'
import { MapPin, Bus } from 'lucide-react'
import { format } from 'date-fns'
import type { RoutePoint } from '@/types/tripDetail.type'

// --- Helper functions giữ nguyên ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatTime = (isoString: string) => {
    return format(new Date(isoString), 'HH:mm')
}

export function BookingSelection({
    routePoints,
    setIsSeatSelect,
    setBasePrice,
    setFromTo,
}: {
    routePoints: RoutePoint[]
    setIsSeatSelect: any
    setBasePrice: any
    setFromTo: any
}) {
    const [originId, setOriginId] = useState<string>('')
    const [destId, setDestId] = useState<string>('')

    // --- Logic xử lý ---
    const sortedPoints = useMemo(() => {
        return [...routePoints].sort((a, b) => a.order - b.order)
    }, [routePoints])

    const originOptions = sortedPoints.slice(0, -1)
    const selectedOrigin = sortedPoints.find((p) => p.stationId === originId)

    const destOptions = useMemo(() => {
        if (!selectedOrigin) return []
        return sortedPoints.filter((p) => p.order > selectedOrigin.order)
    }, [selectedOrigin, sortedPoints])

    const selectedDest = sortedPoints.find((p) => p.stationId === destId)

    const ticketPrice = useMemo(() => {
        if (!selectedOrigin || !selectedDest) return 0
        return selectedDest.priceFromStart - selectedOrigin.priceFromStart
    }, [selectedOrigin, selectedDest])

    const handleOriginChange = (value: string) => {
        setOriginId(value)
        setDestId('')
    }

    return (
        <Card className="w-full shadow-md border-primary/10 overflow-hidden">
            <CardContent className="p-4 md:p-6">
                {/* Layout chính: 
                    - Mobile: flex-col (dọc)
                    - Desktop (md): flex-row (ngang)
                    - items-end: Để căn đáy các input và button cho thẳng hàng
                */}
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                    {/* --- CỘT 1: ĐIỂM ĐI --- */}
                    <div className="flex-1 space-y-2 min-w-[200px]">
                        <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            Điểm đón
                        </label>
                        <Select
                            value={originId}
                            onValueChange={handleOriginChange}
                        >
                            <SelectTrigger className="h-12 bg-background border-muted-foreground/20 focus:ring-primary/20">
                                <div className="flex items-center gap-2 truncate">
                                    <MapPin className="w-4 h-4 text-green-600 shrink-0" />
                                    <SelectValue placeholder="Chọn nơi đi" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {originOptions.map((point) => (
                                    <SelectItem
                                        key={point.stationId}
                                        value={point.stationId}
                                    >
                                        <div className="flex justify-between w-full min-w-[200px] gap-4">
                                            <span className="font-medium">
                                                {point.stationName}
                                            </span>
                                            <span className="text-muted-foreground text-xs flex items-center">
                                                {formatTime(
                                                    point.arrivalTimeISO,
                                                )}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* --- CỘT 2: ĐIỂM ĐẾN --- */}
                    <div className="flex-1 space-y-2 min-w-[200px]">
                        <label className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            Điểm trả
                        </label>
                        <Select
                            value={destId}
                            onValueChange={setDestId}
                            disabled={!originId}
                        >
                            <SelectTrigger className="h-12 bg-background border-muted-foreground/20 focus:ring-primary/20">
                                <div className="flex items-center gap-2 truncate">
                                    <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                                    <SelectValue
                                        placeholder={
                                            !originId
                                                ? 'Chọn điểm đón trước'
                                                : 'Chọn nơi đến'
                                        }
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {destOptions.map((point) => (
                                    <SelectItem
                                        key={point.stationId}
                                        value={point.stationId}
                                    >
                                        <div className="flex justify-between w-full min-w-[200px] gap-4">
                                            <span className="font-medium">
                                                {point.stationName}
                                            </span>
                                            <span className="text-muted-foreground text-xs flex items-center">
                                                {formatTime(
                                                    point.arrivalTimeISO,
                                                )}
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* --- VÁCH NGĂN (Chỉ hiện trên Desktop) --- */}
                    <div className="hidden md:block h-12 w-px bg-border mx-2"></div>

                    {/* --- CỘT 3: GIÁ VÉ & NÚT --- */}
                    <div className="flex flex-row items-center justify-between md:justify-end gap-4 flex-[0.8]">
                        {/* Hiển thị giá (Gọn hơn) */}
                        <div className="flex flex-col items-start md:items-end min-w-[100px]">
                            <span className="text-xs text-muted-foreground font-medium">
                                Giá tiền 1 ghế thường
                            </span>
                            {selectedOrigin && selectedDest ? (
                                <span className="text-xl font-bold text-primary animate-in slide-in-from-bottom-2 fade-in">
                                    {formatCurrency(ticketPrice)}
                                </span>
                            ) : (
                                <span className="text-xl font-bold text-muted-foreground/30">
                                    --
                                </span>
                            )}
                        </div>

                        {/* Nút đặt vé */}
                        <Button
                            className="h-12 px-6 font-semibold shadow-lg shadow-primary/20"
                            disabled={!selectedOrigin || !selectedDest}
                            onClick={() => {
                                console.log('Đặt vé:', {
                                    from: selectedOrigin,
                                    to: selectedDest,
                                    price: ticketPrice,
                                })
                                setBasePrice(ticketPrice)
                                setFromTo({
                                    from: selectedOrigin?.order,
                                    to: selectedDest?.order,
                                })
                                setIsSeatSelect(true)
                            }}
                        >
                            Chọn ghế <Bus className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
