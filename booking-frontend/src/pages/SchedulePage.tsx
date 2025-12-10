import UserHeader from '@/components/helpers/UserHeader'
import FilterSidebar from '@/components/Schedule/FilterSidebar'
import SearchHeader from '@/components/Schedule/SearchHeader'
import TripList from '@/components/Schedule/TripList'
import tripService from '@/services/tripService'

import type { FilterSchedule } from '@/types/filterSchedule'
import type { Trip } from '@/types/trip.type'
import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function SchedulePage() {
    const [tripList, setTripList] = useState<Trip[]>([])
    const [filters, setFilters] = useState<FilterSchedule>({
        origin: '',
        destination: '',
        date: '',
        busType: [],
        departureTime: [],
        sortBy: 'departure-time',
    })
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPages, setTotalPage] = useState<number>(1)
    const [totalItems, setTotalItems] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        const getTripList = async () => {
            setIsLoading(true)
            try {
                const response = await tripService.getAll(filters, currentPage)

                if (response && response.data) {
                    const result = response.data.data
                    setTripList(result.data)
                    setCurrentPage(result.pagination?.page)
                    setTotalPage(result.pagination?.totalPages)
                    setTotalItems(result.pagination?.totalItems)
                }
            } catch (error: any) {
                const message = error.response?.data?.message
                console.error(message)
                toast.error(message)
            } finally {
                setIsLoading(false)
            }
        }
        getTripList()
    }, [currentPage, filters])

    // const mockTrips = [
    //     {
    //         id: 'a0f87f6a-62ab-4853-8ac7-938c6f77e122',
    //         busId: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //         originStationId: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
    //         destStationId: '6c727162-b737-421d-933b-df558d1232d9',
    //         departureTime: '2025-12-06T15:00:00.000Z',
    //         arrivalTime: '2025-12-06T23:00:00.000Z',
    //         basePrice: '155000',
    //         originStation: {
    //             id: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
    //             name: 'Bến xe Miền Tây',
    //             address: '395 Kinh Dương Vương',
    //             province: 'Hồ Chí Minh',
    //         },
    //         destStation: {
    //             id: '6c727162-b737-421d-933b-df558d1232d9',
    //             name: 'Bến xe Giáp Bát',
    //             address: 'Giải Phóng',
    //             province: 'Hà Nội',
    //         },
    //         bus: {
    //             id: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //             plateNumber: '76B-92770',
    //             name: 'Nhà xe 10 - Ghế Ngồi Limousine',
    //             totalSeats: 16,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 8,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: 'dc2f4e33-ee50-41e9-8fe2-9949914ac254',
    //         busId: '14e034c2-ec94-4f4f-9f05-3e9e712d1cdf',
    //         originStationId: '4a58b985-121c-4bd0-b739-7b06c47cecc4',
    //         destStationId: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //         departureTime: '2025-12-08T00:15:00.000Z',
    //         arrivalTime: '2025-12-08T08:15:00.000Z',
    //         basePrice: '114000',
    //         originStation: {
    //             id: '4a58b985-121c-4bd0-b739-7b06c47cecc4',
    //             name: 'Bến xe Đà Nẵng',
    //             address: 'Tôn Đức Thắng',
    //             province: 'Đà Nẵng',
    //         },
    //         destStation: {
    //             id: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //             name: 'Bến xe Sapa',
    //             address: 'Điện Biên Phủ',
    //             province: 'Lào Cai',
    //         },
    //         bus: {
    //             id: '14e034c2-ec94-4f4f-9f05-3e9e712d1cdf',
    //             plateNumber: '43B-74938',
    //             name: 'Nhà xe 9 - Ghế Ngồi Limousine',
    //             totalSeats: 16,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 8,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: 'a3aabe01-7165-4134-8ff5-68401ca5365e',
    //         busId: '77af5e63-41e1-4491-9f40-0d58b581948d',
    //         originStationId: '77172bad-dd79-43f5-9846-13d7b3f0445d',
    //         destStationId: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //         departureTime: '2025-12-08T02:15:00.000Z',
    //         arrivalTime: '2025-12-08T06:15:00.000Z',
    //         basePrice: '129000',
    //         originStation: {
    //             id: '77172bad-dd79-43f5-9846-13d7b3f0445d',
    //             name: 'Bến xe Đà Lạt',
    //             address: '01 Tô Hiến Thành',
    //             province: 'Lâm Đồng',
    //         },
    //         destStation: {
    //             id: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //             name: 'Bến xe Sapa',
    //             address: 'Điện Biên Phủ',
    //             province: 'Lào Cai',
    //         },
    //         bus: {
    //             id: '77af5e63-41e1-4491-9f40-0d58b581948d',
    //             plateNumber: '65B-34167',
    //             name: 'Nhà xe 3 - Ghế Ngồi Limousine',
    //             totalSeats: 16,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 4,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: '3fbd8387-6cfc-4323-8f80-d1e716ce8701',
    //         busId: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //         originStationId: '9a2387c3-e65c-41d1-b342-f5949cbba2da',
    //         destStationId: '1112a612-0ca1-43ac-9022-8bb8d300ad50',
    //         departureTime: '2025-12-09T00:00:00.000Z',
    //         arrivalTime: '2025-12-09T06:00:00.000Z',
    //         basePrice: '249000',
    //         originStation: {
    //             id: '9a2387c3-e65c-41d1-b342-f5949cbba2da',
    //             name: 'Bến xe Miền Đông',
    //             address: '292 Đinh Bộ Lĩnh',
    //             province: 'Hồ Chí Minh',
    //         },
    //         destStation: {
    //             id: '1112a612-0ca1-43ac-9022-8bb8d300ad50',
    //             name: 'Bến xe Nha Trang',
    //             address: 'Đường 23/10',
    //             province: 'Khánh Hòa',
    //         },
    //         bus: {
    //             id: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //             plateNumber: '76B-92770',
    //             name: 'Nhà xe 10 - Ghế Ngồi Limousine',
    //             totalSeats: 16,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 6,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: '81ea54e7-63d5-45a7-afab-6c61272e6b9b',
    //         busId: '18b5691c-cf05-444b-b190-4e1f9e907ed3',
    //         originStationId: 'd131a698-142f-40ae-90fb-9ebea729e22d',
    //         destStationId: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //         departureTime: '2025-12-09T00:15:00.000Z',
    //         arrivalTime: '2025-12-09T08:15:00.000Z',
    //         basePrice: '151000',
    //         originStation: {
    //             id: 'd131a698-142f-40ae-90fb-9ebea729e22d',
    //             name: 'Bến xe Vũng Tàu',
    //             address: 'Nam Kỳ Khởi Nghĩa',
    //             province: 'Bà Rịa - Vũng Tàu',
    //         },
    //         destStation: {
    //             id: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //             name: 'Bến xe Sapa',
    //             address: 'Điện Biên Phủ',
    //             province: 'Lào Cai',
    //         },
    //         bus: {
    //             id: '18b5691c-cf05-444b-b190-4e1f9e907ed3',
    //             plateNumber: '63B-94696',
    //             name: 'Nhà xe 1 - Ghế Thường',
    //             totalSeats: 40,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 8,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: '664cdc40-5da2-4474-827c-cf0d10b36687',
    //         busId: '50d3af54-a224-4081-aec0-d63e4bb628b4',
    //         originStationId: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
    //         destStationId: '77172bad-dd79-43f5-9846-13d7b3f0445d',
    //         departureTime: '2025-12-09T15:15:00.000Z',
    //         arrivalTime: '2025-12-10T03:15:00.000Z',
    //         basePrice: '218000',
    //         originStation: {
    //             id: '614aadda-a2d7-4e5d-9291-33dc099b8ded',
    //             name: 'Bến xe Miền Tây',
    //             address: '395 Kinh Dương Vương',
    //             province: 'Hồ Chí Minh',
    //         },
    //         destStation: {
    //             id: '77172bad-dd79-43f5-9846-13d7b3f0445d',
    //             name: 'Bến xe Đà Lạt',
    //             address: '01 Tô Hiến Thành',
    //             province: 'Lâm Đồng',
    //         },
    //         bus: {
    //             id: '50d3af54-a224-4081-aec0-d63e4bb628b4',
    //             plateNumber: '70B-34282',
    //             name: 'Nhà xe 7 - Ghế Ngồi Limousine',
    //             totalSeats: 16,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 12,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: '939a82a4-c814-48cc-889c-e6a6d56a04d0',
    //         busId: '071bcb5b-5d13-4d4c-8745-b26474cdfc5c',
    //         originStationId: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //         destStationId: '1112a612-0ca1-43ac-9022-8bb8d300ad50',
    //         departureTime: '2025-12-10T12:30:00.000Z',
    //         arrivalTime: '2025-12-10T16:30:00.000Z',
    //         basePrice: '323000',
    //         originStation: {
    //             id: 'e1d50fd2-e1dd-47bd-a519-4ae000f97ed6',
    //             name: 'Bến xe Sapa',
    //             address: 'Điện Biên Phủ',
    //             province: 'Lào Cai',
    //         },
    //         destStation: {
    //             id: '1112a612-0ca1-43ac-9022-8bb8d300ad50',
    //             name: 'Bến xe Nha Trang',
    //             address: 'Đường 23/10',
    //             province: 'Khánh Hòa',
    //         },
    //         bus: {
    //             id: '071bcb5b-5d13-4d4c-8745-b26474cdfc5c',
    //             plateNumber: '73B-89636',
    //             name: 'Nhà xe 8 - Giường Nằm',
    //             totalSeats: 34,
    //             type: 'SINGLE_BED',
    //         },
    //         hoursTime: 4,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: 'bf6bdeaf-fa5e-4cf2-9e66-43d650fc9948',
    //         busId: '77af5e63-41e1-4491-9f40-0d58b581948d',
    //         originStationId: '9a2387c3-e65c-41d1-b342-f5949cbba2da',
    //         destStationId: 'f2881305-5aee-41aa-a51f-aa8b16a2e268',
    //         departureTime: '2025-12-10T15:30:00.000Z',
    //         arrivalTime: '2025-12-11T00:30:00.000Z',
    //         basePrice: '217000',
    //         originStation: {
    //             id: '9a2387c3-e65c-41d1-b342-f5949cbba2da',
    //             name: 'Bến xe Miền Đông',
    //             address: '292 Đinh Bộ Lĩnh',
    //             province: 'Hồ Chí Minh',
    //         },
    //         destStation: {
    //             id: 'f2881305-5aee-41aa-a51f-aa8b16a2e268',
    //             name: 'Bến xe Mỹ Đình',
    //             address: '20 Phạm Hùng',
    //             province: 'Hà Nội',
    //         },
    //         bus: {
    //             id: '77af5e63-41e1-4491-9f40-0d58b581948d',
    //             plateNumber: '65B-34167',
    //             name: 'Nhà xe 3 - Ghế Ngồi Limousine',
    //             totalSeats: 16,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 9,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: '8f046a51-82cc-4e00-ae70-adbfce0ccf6c',
    //         busId: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //         originStationId: '1112a612-0ca1-43ac-9022-8bb8d300ad50',
    //         destStationId: '9a2387c3-e65c-41d1-b342-f5949cbba2da',
    //         departureTime: '2025-12-11T00:15:00.000Z',
    //         arrivalTime: '2025-12-11T10:15:00.000Z',
    //         basePrice: '249000',
    //         originStation: {
    //             id: '1112a612-0ca1-43ac-9022-8bb8d300ad50',
    //             name: 'Bến xe Nha Trang',
    //             address: 'Đường 23/10',
    //             province: 'Khánh Hòa',
    //         },
    //         destStation: {
    //             id: '9a2387c3-e65c-41d1-b342-f5949cbba2da',
    //             name: 'Bến xe Miền Đông',
    //             address: '292 Đinh Bộ Lĩnh',
    //             province: 'Hồ Chí Minh',
    //         },
    //         bus: {
    //             id: 'ec49a138-5975-4de3-8550-2a8ed1ba06f0',
    //             plateNumber: '76B-92770',
    //             name: 'Nhà xe 10 - Ghế Ngồi Limousine',
    //             totalSeats: 16,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 10,
    //         minutesTime: 0,
    //     },
    //     {
    //         id: 'aa559dd9-4f5e-49ec-8848-3a699f9f1b97',
    //         busId: '18b5691c-cf05-444b-b190-4e1f9e907ed3',
    //         originStationId: '6c727162-b737-421d-933b-df558d1232d9',
    //         destStationId: '77172bad-dd79-43f5-9846-13d7b3f0445d',
    //         departureTime: '2025-12-11T06:30:00.000Z',
    //         arrivalTime: '2025-12-11T13:30:00.000Z',
    //         basePrice: '195000',
    //         originStation: {
    //             id: '6c727162-b737-421d-933b-df558d1232d9',
    //             name: 'Bến xe Giáp Bát',
    //             address: 'Giải Phóng',
    //             province: 'Hà Nội',
    //         },
    //         destStation: {
    //             id: '77172bad-dd79-43f5-9846-13d7b3f0445d',
    //             name: 'Bến xe Đà Lạt',
    //             address: '01 Tô Hiến Thành',
    //             province: 'Lâm Đồng',
    //         },
    //         bus: {
    //             id: '18b5691c-cf05-444b-b190-4e1f9e907ed3',
    //             plateNumber: '63B-94696',
    //             name: 'Nhà xe 1 - Ghế Thường',
    //             totalSeats: 40,
    //             type: 'SEAT',
    //         },
    //         hoursTime: 7,
    //         minutesTime: 0,
    //     },
    // ]

    return (
        <>
            <UserHeader />

            <div className="min-h-screen bg-background">
                <SearchHeader filters={filters} onSearchChange={setFilters} />

                <div className="flex gap-6 px-4 py-8 max-w-7xl mx-auto">
                    <FilterSidebar
                        filters={filters}
                        onFiltersChange={setFilters}
                    />

                    {isLoading ? (
                        // Giao diện khi đang tải
                        <div className="flex flex-col items-center justify-center py-10 w-full h-64">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-muted-foreground mt-2 text-sm">
                                Đang tìm chuyến xe...
                            </p>
                        </div>
                    ) : (
                        <TripList
                            trips={tripList}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalResults={totalItems}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
