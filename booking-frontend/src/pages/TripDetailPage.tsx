import LoadingSpin from '@/components/helpers/LoadingSpin'
import SeatSelector from '@/components/TripDetail/SeatSelector'
import TripInfo from '@/components/TripDetail/TripInfo'
import tripService from '@/services/tripService'
import type { Trip } from '@/types/trip.type'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function TripDetailPage() {
    // Dữ liệu mẫu chuyến xe
    // const tripData = {
    //     id: 'a0f87f6a-62ab-4853-8ac7-938c6f77e122',
    //     busId: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //     originStationId: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
    //     destStationId: '6c727162-b737-421d-933b-df558d1232d9',
    //     departureTime: '2025-12-06T15:00:00.000Z',
    //     arrivalTime: '2025-12-06T23:00:00.000Z',
    //     basePrice: 155000,
    //     originStation: {
    //         id: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
    //         name: 'Bến xe Miền Tây',
    //         address: '395 Kinh Dương Vương',
    //         province: 'Hồ Chí Minh',
    //     },
    //     destStation: {
    //         id: '6c727162-b737-421d-933b-df558d1232d9',
    //         name: 'Bến xe Giáp Bát',
    //         address: 'Giải Phóng',
    //         province: 'Hà Nội',
    //     },
    //     bus: {
    //         id: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //         plateNumber: '76B-92770',
    //         name: 'Nhà xe 10 - Ghế Ngồi Limousine',
    //         totalSeats: 16,
    //         type: 'SEAT' as SeatType,
    //     },
    //     hoursTime: 8,
    //     minutesTime: 0,
    // }
    const [tripData, setTripData] = useState<Trip>({
        id: '',
        busId: '',
        originStationId: '',
        destStationId: '',
        departureTime: '', // ISO Date String
        arrivalTime: '',
        basePrice: 0,
        hoursTime: 0,
        minutesTime: 0,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const getTripDetail = async () => {
            setIsLoading(true)
            try {
                const { id } = useParams<{ id: string }>()

                if (!id) {
                    throw new Error('Không tìm thấy id chuyến')
                }

                const response = await tripService.getById(id)

                if (response && response.data) {
                    setTripData(response.data)
                }
            } catch (error: any) {
                const message = error.response?.data?.message
                console.error(message)
                toast.error(message)
            } finally {
                setIsLoading(false)
            }
        }

        getTripDetail()
    }, [])

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 py-8">
            {isLoading ? (
                <LoadingSpin content="Đang tải thông tin chuyến xe" />
            ) : (
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Chi tiết chuyến xe
                    </h1>

                    {/* Thông tin chuyến xe */}
                    <TripInfo trip={tripData} />

                    {/* Phần chọn ghế và tóm tắt đặt vé */}
                    <div className="grid lg:grid-cols-3 gap-6 mt-6">
                        <div className="lg:col-span-2">
                            <SeatSelector tripId={tripData.id} />
                        </div>
                        <div className="lg:col-span-1">
                            <BookingSummary trip={tripData} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
