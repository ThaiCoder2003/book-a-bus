import SeatSelector from '@/components/TripDetail/SeatSelector'
import TripInfo from '@/components/TripDetail/TripInfo'
import type { SeatType } from '@/types/enum'

export default function TripDetailPage() {
    // Dữ liệu mẫu chuyến xe
    const tripData = {
        id: 'a0f87f6a-62ab-4853-8ac7-938c6f77e122',
        busId: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
        originStationId: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
        destStationId: '6c727162-b737-421d-933b-df558d1232d9',
        departureTime: '2025-12-06T15:00:00.000Z',
        arrivalTime: '2025-12-06T23:00:00.000Z',
        basePrice: 155000,
        originStation: {
            id: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
            name: 'Bến xe Miền Tây',
            address: '395 Kinh Dương Vương',
            province: 'Hồ Chí Minh',
        },
        destStation: {
            id: '6c727162-b737-421d-933b-df558d1232d9',
            name: 'Bến xe Giáp Bát',
            address: 'Giải Phóng',
            province: 'Hà Nội',
        },
        bus: {
            id: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
            plateNumber: '76B-92770',
            name: 'Nhà xe 10 - Ghế Ngồi Limousine',
            totalSeats: 16,
            type: 'SEAT' as SeatType,
        },
        hoursTime: 8,
        minutesTime: 0,
    }

    // Dữ liệu ghế - 80 ghế, 2 tầng, 5 cột (2-2-lối đi-2-2)
    const seats = []
    for (let floor = 1; floor <= 2; floor++) {
        for (let row = 1; row <= 8; row++) {
            for (let col = 1; col <= 5; col++) {
                seats.push({
                    id: `${floor}-${row}-${col}`,
                    floor: floor,
                    row: row,
                    column: col,
                    number: seats.length + 1,
                    status: Math.random() > 0.7 ? 'booked' : 'available',
                })
            }
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    Chi tiết chuyến xe
                </h1>

                {/* Thông tin chuyến xe */}
                <TripInfo trip={tripData} />

                {/* Phần chọn ghế và tóm tắt đặt vé */}
                <div className="grid lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                        <SeatSelector
                            tripId={tripData.id}
                            busId={tripData.busId}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <BookingSummary trip={tripData} />
                    </div>
                </div>
            </div>
        </div>
    )
}
