import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Armchair } from 'lucide-react'
import { useEffect, useState } from 'react'
import seatService from '@/services/seatService'
import { toast } from 'react-toastify'
import type { Seat } from '@/types/seat.type'
import LoadingSpin from '../helpers/LoadingSpin'

export function SeatSelector({ tripId }: { tripId: string }) {
    const [seatList, setSeatList] = useState<Seat[]>([])
    const [occupiedSeats, setOccupiedSeats] = useState<string[]>([])
    const [mySelectedSeats, setMySelectedSeats] = useState<string[]>([])
    const [loadingSeatId, setLoadingSeatId] = useState(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const getSeatByTrip = async () => {
            setIsLoading(true)
            try {
                const response = await seatService.getByTrip(tripId)

                if (response && response.data) {
                    setSeatList(response.data)
                }
            } catch (error: any) {
                const message = error.response?.data?.message
                console.error(message)
                toast.error(message)
            } finally {
                setIsLoading(false)
            }
        }

        getSeatByTrip()
    }, [])

    const handleSeatClick = async (seatId: string) => {
        if (occupiedSeats.includes(seatId) || loadingSeatId) return;
    }

    const seatListByFloor = seatList.reduce<Seat[][]>((acc, seat) => {
        const floorNumber = seat.floor
        if (!acc[floorNumber - 1]) {
            acc[floorNumber - 1] = []
        }
        acc[floorNumber - 1].push(seat)

        return acc
    }, [])

    const maxRow = Math.max(...seatList.map((s) => s.row))
    const maxCol = Math.max(...seatList.map((s) => s.col))

    const renderSeatGrid = (floorSeats: Seat[], floorLabel: string) => {
        // Tạo ma trận ghế
        const seatMatrix: (Seat | null)[][] = Array.from(
            { length: maxRow },
            () => Array.from({ length: maxCol }, () => null),
        )

        // Điền ghế vào ma trận theo vị trí
        floorSeats.forEach((seat) => {
            if (
                seat.row > 0 &&
                seat.row <= maxRow &&
                seat.col > 0 &&
                seat.col <= maxCol
            ) {
                seatMatrix[seat.row - 1][seat.col - 1] = seat
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
                                            className="aspect-square min-h-9"
                                        />
                                    )
                                }

                                return (
                                    <button
                                        key={seat.id}
                                        onClick={() => handleSeatClick(seat.id)}
                                        disabled={seat.tickets?.length !== 0}
                                        className={cn(
                                            'aspect-square rounded border-2 flex flex-col items-center justify-center transition-all hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-9',
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
                                            {seat.label}
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
            {isLoading ? (
                <LoadingSpin content="Đang tải danh sách ghế" />
            ) : (
                <div className="grid md:grid-cols-2 gap-4">
                    {seatListByFloor.map((seatList, i) => {
                        if (seatList && seatList.length > 0) {
                            return renderSeatGrid(seatList, `Tầng ${i + 1}`)
                        }
                    })}
                </div>
            )}
        </div>
    )
}

export default SeatSelector
