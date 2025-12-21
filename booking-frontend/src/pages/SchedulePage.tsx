import LoadingSpin from '@/components/helpers/LoadingSpin'
import UserHeader from '@/components/helpers/UserHeader'
import FilterSidebar from '@/components/Schedule/FilterSidebar'
import SearchHeader from '@/components/Schedule/SearchHeader'
import TripList from '@/components/Schedule/TripList'
import tripService from '@/services/tripService'

import type { FilterSchedule } from '@/types/filterSchedule'
import type { Trip } from '@/types/trip.type'
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
                        <LoadingSpin content="Đang tìm chuyến xe" />
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
