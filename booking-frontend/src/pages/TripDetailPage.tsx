import LoadingSpin from '@/components/helpers/LoadingSpin'
import { BookingSelection } from '@/components/TripDetail/BookingSelection'
import SeatSelector from '@/components/TripDetail/SeatSelector'
import TripInfo from '@/components/TripDetail/TripInfo'
import tripService from '@/services/tripService'
import type { TripDetail } from '@/types/tripDetail.type'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function TripDetailPage() {
    const [tripData, setTripData] = useState<TripDetail>({
        tripId: '',
        busName: '',
        plateNumber: '',
        totalSeats: 0,
        routePoints: [],
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSeatSelect, setIsSeatSelect] = useState<boolean>(false)
    const [basePrice, setBasePrice] = useState<number>(0)
    const [fromTo, setFromTo] = useState({
        from: 1,
        to: 2,
    })
    const { id } = useParams()

    useEffect(() => {
        const getTripDetail = async () => {
            setIsLoading(true)
            try {
                if (!id) {
                    throw new Error('Không tìm thấy id chuyến')
                }

                const response = await tripService.getById(id)

                if (response && response.data) {
                    setTripData(response.data.data)
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

                    {isSeatSelect ? (
                        // Phần chọn ghế và tóm tắt đặt vé
                        <div className="grid lg:grid-cols-3 gap-6 mt-6">
                            <div className="lg:col-span-2">
                                <SeatSelector tripId={tripData.tripId} fromTo={fromTo} />
                            </div>
                            {/* <div className="lg:col-span-1">
                                <BookingSummary trip={tripData} />
                            </div> */}
                        </div>
                    ) : (
                        <BookingSelection
                            routePoints={tripData.routePoints}
                            setIsSeatSelect={setIsSeatSelect}
                            setBasePrice={setBasePrice}
                            setFromTo={setFromTo}
                        />
                    )}
                </div>
            )}
        </div>
    )
}
