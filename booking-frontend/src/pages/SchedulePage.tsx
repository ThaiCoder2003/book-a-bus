import UserHeader from '@/components/helpers/UserHeader'
import FilterSidebar from '@/components/Schedule/FilterSidebar'
import SearchHeader from '@/components/Schedule/SearchHeader'
import TripList from '@/components/Schedule/TripList'
import tripService from '@/services/tripService'

import type { FilterSchedule } from '@/types/filterSchedule'
import { useState, useMemo, useEffect } from 'react'
import { toast } from 'react-toastify'

export default function SchedulePage() {
    const [tripList, setTripList] = useState({})

    const [searchParams, setSearchParams] = useState({
        origin: '',
        destination: '',
        date: '',
    })

    const [filters, setFilters] = useState<FilterSchedule>({
        busType: [],
        priceRange: [0, 5000000],
        departureTime: [],
    })

    const [sortBy, setSortBy] = useState('recommended')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPage] = useState(1)

    useEffect(() => {
        const getTripList = async () => {
            try {
                const response = await tripService.getAll(
                    searchParams.date,
                    searchParams.origin,
                    searchParams.destination,
                )

                if (response && response.data) {
                    const result = response.data
                    setTripList(result.data)
                    setCurrentPage(result.pagination?.page)
                    setTotalPage(result.pagination?.totalPages)
                }

                console.clear()
                console.log(tripList)
                console.log(currentPage)
                console.log(totalPages)
            } catch (error: any) {
                const message = error.response?.data?.messag
                console.error(message)
                toast.error(message)
            }
        }
        getTripList()
    }, [currentPage, totalPages])

    // Mock data - replace with API call
    const mockTrips = useMemo(
        () => [
            {
                id: 1,
                operator: 'Golden Bus',
                origin: 'Hà Nội',
                destination: 'Hồ Chí Minh',
                departure: '22:00',
                arrival: '06:00',
                duration: '8h',
                price: 450000,
                busType: 'Giường đôi',
                rating: 4.8,
                reviews: 234,
                image: '/bus-seat.jpg',
            },
            {
                id: 2,
                operator: 'Việt Express',
                origin: 'Hà Nội',
                destination: 'Hồ Chí Minh',
                departure: '20:30',
                arrival: '05:30',
                duration: '9h',
                price: 350000,
                busType: 'Ghế ngồi',
                rating: 4.5,
                reviews: 156,
                image: '/bus-seat.jpg',
            },
            {
                id: 3,
                operator: 'Luxury Coach',
                origin: 'Hà Nội',
                destination: 'Hồ Chí Minh',
                departure: '19:00',
                arrival: '04:00',
                duration: '9h',
                price: 650000,
                busType: 'Giường đơn',
                rating: 4.9,
                reviews: 512,
                image: '/bus-seat.jpg',
            },
            {
                id: 4,
                operator: 'Golden Bus',
                origin: 'Hà Nội',
                destination: 'Hồ Chí Minh',
                departure: '23:00',
                arrival: '07:00',
                duration: '8h',
                price: 500000,
                busType: 'Giường đôi',
                rating: 4.7,
                reviews: 189,
                image: '/bus-seat.jpg',
            },
            {
                id: 5,
                operator: 'Fast Travel',
                origin: 'Hà Nội',
                destination: 'Hồ Chí Minh',
                departure: '06:00',
                arrival: '14:00',
                duration: '8h',
                price: 400000,
                busType: 'Ghế ngồi',
                rating: 4.3,
                reviews: 98,
                image: '/bus-seat.jpg',
            },
            {
                id: 6,
                operator: 'Hanoi Coach',
                origin: 'Hà Nội',
                destination: 'Hồ Chí Minh',
                departure: '14:00',
                arrival: '22:00',
                duration: '8h',
                price: 380000,
                busType: 'Ghế ngồi',
                rating: 4.2,
                reviews: 145,
                image: '/bus-seat.jpg',
            },
        ],
        [],
    )

    // Filter and sort trips
    const filteredTrips = useMemo(() => {
        let result = mockTrips

        // Filter by bus type
        if (filters.busType.length > 0) {
            result = result.filter((trip) =>
                filters.busType.includes(trip.busType),
            )
        }

        // Filter by price range
        result = result.filter(
            (trip) =>
                trip.price >= filters.priceRange[0] &&
                trip.price <= filters.priceRange[1],
        )

        // Filter by departure time
        if (filters.departureTime.length > 0) {
            result = result.filter((trip) => {
                const hour = Number.parseInt(trip.departure)
                return filters.departureTime.some((range) => {
                    if (range === 'morning') return hour >= 6 && hour < 12
                    if (range === 'afternoon') return hour >= 12 && hour < 18
                    if (range === 'evening') return hour >= 18 && hour < 24
                    if (range === 'night') return hour >= 0 && hour < 6
                    return false
                })
            })
        }

        // Sort trips
        if (sortBy === 'price-low') {
            result = [...result].sort((a, b) => a.price - b.price)
        } else if (sortBy === 'price-high') {
            result = [...result].sort((a, b) => b.price - a.price)
        } else if (sortBy === 'rating') {
            result = [...result].sort((a, b) => b.rating - a.rating)
        } else if (sortBy === 'duration') {
            result = [...result].sort((a, b) => {
                const durationA = Number.parseInt(a.duration)
                const durationB = Number.parseInt(b.duration)
                return durationA - durationB
            })
        }

        return result
    }, [filters, sortBy, mockTrips])

    const displayedTrips = filteredTrips.slice(
        (currentPage - 1) * 5,
        currentPage * 5,
    )

    return (
        <>
            <UserHeader />

            <div className="min-h-screen bg-background">
                <SearchHeader
                    searchParams={searchParams}
                    onSearchChange={setSearchParams}
                />

                <div className="flex gap-6 px-4 py-8 max-w-7xl mx-auto">
                    <FilterSidebar
                        filters={filters}
                        onFiltersChange={setFilters}
                        onSortChange={setSortBy}
                        sortBy={sortBy}
                    />

                    <TripList
                        trips={displayedTrips}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalResults={filteredTrips.length}
                    />
                </div>
            </div>
        </>
    )
}
