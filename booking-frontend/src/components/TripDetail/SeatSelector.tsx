'use client'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Armchair } from 'lucide-react'

export function SeatSelector({
    tripId,
    busId,
}: {
    tripId: string
    busId: string
}) {
    const handleSeatClick = (seatId, currentStatus) => {
        if (currentStatus === 'occupied') return

        if (selectedSeats.includes(seatId)) {
            onSeatSelect(selectedSeats.filter((id) => id !== seatId))
        } else {
            onSeatSelect([...selectedSeats, seatId])
        }
    }

    const getSeatStatus = (seat) => {
        if (seat.status === 'occupied') return 'occupied'
        return selectedSeats.includes(seat.id) ? 'selected' : 'available'
    }

    const lowerFloorSeats = seats.filter((s) => s.floor === 1)
    const upperFloorSeats = seats.filter((s) => s.floor === 2)

    const maxRow = Math.max(...seats.map((s) => s.row))
    const maxCol = Math.max(...seats.map((s) => s.column))

    const renderSeatGrid = (floorSeats, floorLabel) => {
        // Tạo ma trận ghế
        const seatMatrix = Array.from({ length: maxRow }, () =>
            Array.from({ length: maxCol }, () => null),
        )

        // Điền ghế vào ma trận theo vị trí
        floorSeats.forEach((seat) => {
            if (
                seat.row > 0 &&
                seat.row <= maxRow &&
                seat.column > 0 &&
                seat.column <= maxCol
            ) {
                seatMatrix[seat.row - 1][seat.column - 1] = seat
            }
        })

        return (
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                        {floorLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                        {floorSeats.length} ghế
                    </span>
                </div>
                <div className="relative bg-card border-2 rounded-lg p-3">
                    {/* Driver indicator for lower floor */}
                    {floorLabel.includes('dưới') && (
                        <div className="absolute -top-2.5 left-3 bg-secondary px-2 py-0.5 rounded-full text-[10px] font-medium">
                            🚗 Lái xe
                        </div>
                    )}

                    <div
                        className="grid gap-1.5"
                        style={{
                            gridTemplateColumns: `repeat(${maxCol}, minmax(0, 1fr))`,
                        }}
                    >
                        {seatMatrix.map((row, rowIdx) =>
                            row.map((seat, colIdx) => {
                                if (!seat) {
                                    // Ô trống (lối đi)
                                    return (
                                        <div
                                            key={`empty-${rowIdx}-${colIdx}`}
                                            className="aspect-square min-h-[36px]"
                                        />
                                    )
                                }

                                const status = getSeatStatus(seat)
                                return (
                                    <button
                                        key={seat.id}
                                        onClick={() =>
                                            handleSeatClick(seat.id, status)
                                        }
                                        disabled={status === 'occupied'}
                                        className={cn(
                                            'aspect-square rounded border-2 flex flex-col items-center justify-center transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[36px]',
                                            status === 'available' &&
                                                'border-border bg-card hover:border-primary/50',
                                            status === 'selected' &&
                                                'border-primary bg-primary text-primary-foreground shadow-md',
                                            status === 'occupied' &&
                                                'border-muted bg-muted opacity-50',
                                        )}
                                    >
                                        <Armchair className="h-3 w-3 mb-0.5" />
                                        <span className="text-[9px] font-semibold">
                                            {seat.id}
                                        </span>
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
        <div className="space-y-4">
            {/* Legend */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded border-2 border-border bg-card flex items-center justify-center">
                        <Armchair className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">Trống</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded border-2 border-primary bg-primary flex items-center justify-center">
                        <Armchair className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-muted-foreground">Đang chọn</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded border-2 border-muted bg-muted flex items-center justify-center opacity-50">
                        <Armchair className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="text-muted-foreground">Đã đặt</span>
                </div>
            </div>

            {/* Seat Map */}
            <div className="grid md:grid-cols-2 gap-4">
                {lowerFloorSeats.length > 0 &&
                    renderSeatGrid(lowerFloorSeats, 'Tầng dưới')}

                {upperFloorSeats.length > 0 &&
                    renderSeatGrid(upperFloorSeats, 'Tầng trên')}
            </div>
        </div>
    )
}

export default SeatSelector
