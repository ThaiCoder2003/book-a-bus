import { Button } from '@/components/ui/button'
import TripCard from './TripCard'
import type { Dispatch, SetStateAction } from 'react'
import type { TripInTripList } from '@/types/tripInTripList.type'

interface TripResultsProps {
    trips: TripInTripList[]
    currentPage: number
    totalPages: number
    onPageChange: Dispatch<SetStateAction<number>>
    totalResults: number
}

export default function TripList({
    trips,
    currentPage,
    totalPages,
    onPageChange,
    totalResults,
}: TripResultsProps) {
    return (
        <div className="flex-1">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                    Tìm thấy {totalResults} chuyến xe
                </h2>
            </div>

            <div className="space-y-4">
                {trips.length > 0 ? (
                    <>
                        {trips.map((trip) => (
                            <TripCard key={trip.id} trip={trip} />
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8 pt-4 border-t border-border">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        onPageChange(
                                            Math.max(1, currentPage - 1),
                                        )
                                    }
                                    disabled={currentPage === 1}
                                    className="border-border"
                                >
                                    Trước
                                </Button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                ).map((page) => (
                                    <Button
                                        key={page}
                                        variant={
                                            currentPage === page
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() => onPageChange(page)}
                                        className={
                                            currentPage === page
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border-border'
                                        }
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        onPageChange(
                                            Math.min(
                                                totalPages,
                                                currentPage + 1,
                                            ),
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className="border-border"
                                >
                                    Tiếp
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            Không tìm thấy chuyến xe phù hợp
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
