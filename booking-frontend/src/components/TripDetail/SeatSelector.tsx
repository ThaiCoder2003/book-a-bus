import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Armchair, Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import seatService from '@/services/seatService'
import { toast } from 'react-toastify'
import type { Seat } from '@/types/seat.type'
import LoadingSpin from '../helpers/LoadingSpin'

export function SeatSelector({
    tripId,
    fromTo,
    onSeatSelect,
}: {
    tripId: string
    fromTo: {
        from: number
        to: number
    }
    onSeatSelect?: (seats: Seat[]) => void
}) {
    const [seatList, setSeatList] = useState<Seat[]>([])
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const getSeatByTrip = async () => {
            setIsLoading(true)
            // Reset selection khi đổi trip hoặc lộ trình
            setSelectedSeats([])
            if (onSeatSelect) onSeatSelect([])

            try {
                const response = await seatService.getByTrip(
                    tripId,
                    fromTo.from,
                    fromTo.to,
                )

                // Dựa trên cấu trúc JSON bạn cung cấp: { message: "...", data: [...] }
                if (response && response.data) {
                    // Kiểm tra xem data nằm trực tiếp hay trong data.data tùy vào axios interceptor
                    const data = Array.isArray(response.data)
                        ? response.data
                        : response.data.data
                    setSeatList(data || [])
                }
            } catch (error: any) {
                const message =
                    error.response?.data?.message || 'Lỗi tải danh sách ghế'
                console.error(message)
                toast.error(message)
            } finally {
                setIsLoading(false)
            }
        }

        if (tripId) {
            getSeatByTrip()
        }
    }, [tripId, fromTo.from, fromTo.to])

    const handleSeatClick = (seat: Seat) => {
        if (!seat.isAvailable) return

        let newSelectedSeats = [...selectedSeats]
        const isSelected = selectedSeats.find((s) => s.id === seat.id)

        if (isSelected) {
            // Bỏ chọn
            newSelectedSeats = newSelectedSeats.filter((s) => s.id !== seat.id)
        } else {
            // Chọn thêm (Có thể thêm logic giới hạn số ghế tối đa tại đây)
            newSelectedSeats.push(seat)
        }

        setSelectedSeats(newSelectedSeats)

        // Gọi callback để báo cho component cha biết
        if (onSeatSelect) {
            onSeatSelect(newSelectedSeats)
        }
    }

    // Tách ghế theo tầng (Floor 1 & 2)
    const seatListByFloor = seatList.reduce<Record<number, Seat[]>>(
        (acc, seat) => {
            const floor = seat.floor
            if (!acc[floor]) {
                acc[floor] = []
            }
            acc[floor].push(seat)
            return acc
        },
        {},
    )

    // Tìm max row/col để vẽ Grid
    const maxRow = Math.max(...seatList.map((s) => s.row), 0)
    const maxCol = Math.max(...seatList.map((s) => s.col), 0)

    const renderSeatGrid = (floorSeats: Seat[], floorLabel: string) => {
        // Tạo ma trận ghế để hiển thị đúng vị trí (kể cả lối đi)
        const seatMatrix: (Seat | null)[][] = Array.from(
            { length: maxRow },
            () => Array.from({ length: maxCol }, () => null),
        )

        floorSeats.forEach((seat) => {
            if (seat.row > 0 && seat.col > 0) {
                seatMatrix[seat.row - 1][seat.col - 1] = seat
            }
        })

        return (
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                    <Badge
                        variant="outline"
                        className="text-sm font-medium px-3 py-1"
                    >
                        {floorLabel}
                    </Badge>
                </div>

                <div className="relative bg-card border rounded-xl p-4 shadow-sm">
                    {/* Driver indicator */}
                    {floorLabel.includes('1') && (
                        <div className="absolute -top-3 left-4 bg-muted border text-muted-foreground px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                            Vô lăng
                        </div>
                    )}

                    <div
                        className="grid gap-3"
                        style={{
                            gridTemplateColumns: `repeat(${maxCol}, minmax(0, 1fr))`,
                        }}
                    >
                        {seatMatrix.map((row, rowIdx) =>
                            row.map((seat, colIdx) => {
                                // Render khoảng trống (lối đi)
                                if (!seat) {
                                    return (
                                        <div
                                            key={`empty-${rowIdx}-${colIdx}`}
                                            className="w-10 h-10" // Kích thước bằng ghế
                                        />
                                    )
                                }

                                const isSelected = selectedSeats.some(
                                    (s) => s.id === seat.id,
                                )
                                const isOccupied = !seat.isAvailable

                                return (
                                    <button
                                        key={seat.id}
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={isOccupied}
                                        className={cn(
                                            'relative w-10 h-10 rounded-lg border flex items-center justify-center transition-all duration-200',
                                            // 1. Trạng thái đã đặt (Occupied)
                                            isOccupied &&
                                                'bg-muted text-muted-foreground border-transparent cursor-not-allowed opacity-60',

                                            // 2. Trạng thái đang chọn (Selected)
                                            isSelected &&
                                                'bg-primary border-primary text-primary-foreground shadow-md scale-105 ring-2 ring-primary ring-offset-1',

                                            // 3. Trạng thái trống (Available)
                                            !isOccupied &&
                                                !isSelected &&
                                                'bg-background hover:border-primary hover:text-primary hover:bg-primary/5',

                                            // Màu đặc biệt cho VIP (nếu cần)
                                            seat.type === 'VIP' &&
                                                !isOccupied &&
                                                !isSelected &&
                                                'border-yellow-500/50 text-yellow-600',
                                        )}
                                        title={`${seat.label} - ${seat.type}`}
                                    >
                                        <Armchair
                                            className="w-5 h-5"
                                            strokeWidth={2.5}
                                        />

                                        {/* Label ghế nhỏ ở góc */}
                                        <span className="absolute -bottom-2 text-[9px] font-bold bg-background px-1 rounded border shadow-sm z-10">
                                            {seat.label}
                                        </span>

                                        {/* Icon check khi chọn */}
                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 bg-white text-primary rounded-full p-0.5 shadow-sm">
                                                <Check className="w-2 h-2" />
                                            </div>
                                        )}
                                    </button>
                                )
                            }),
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 w-full">
            {/* Chú thích (Legend) */}
            <div className="flex flex-wrap gap-4 justify-center text-sm border-b pb-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border bg-background flex items-center justify-center">
                        <Armchair className="w-4 h-4 text-foreground" />
                    </div>
                    <span>Trống</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border bg-primary flex items-center justify-center text-primary-foreground">
                        <Armchair className="w-4 h-4" />
                    </div>
                    <span>Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border bg-muted flex items-center justify-center text-muted-foreground opacity-60">
                        <Armchair className="w-4 h-4" />
                    </div>
                    <span>Đã đặt</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded border border-yellow-500/50 flex items-center justify-center text-yellow-600">
                        <Armchair className="w-4 h-4" />
                    </div>
                    <span>VIP</span>
                </div>
            </div>

            {/* Sơ đồ ghế */}
            {isLoading ? (
                <div className="py-10">
                    <LoadingSpin content="Đang tải sơ đồ xe..." />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8 justify-center">
                    {/* Tầng 1 */}
                    {seatListByFloor[1] &&
                        seatListByFloor[1].length > 0 &&
                        renderSeatGrid(seatListByFloor[1], 'Tầng 1 (Dưới)')}

                    {/* Tầng 2 */}
                    {seatListByFloor[2] &&
                        seatListByFloor[2].length > 0 &&
                        renderSeatGrid(seatListByFloor[2], 'Tầng 2 (Trên)')}

                    {seatList.length === 0 && (
                        <div className="col-span-2 text-center text-muted-foreground py-8">
                            Không tìm thấy dữ liệu ghế cho chuyến xe này.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SeatSelector
