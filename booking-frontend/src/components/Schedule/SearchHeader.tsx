// import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import type { FilterSchedule } from '@/types/filterSchedule'

interface SearchHeaderProps {
    filters: FilterSchedule
    onSearchChange: Dispatch<SetStateAction<FilterSchedule>>
}

export default function SearchHeader({
    filters,
    onSearchChange,
}: SearchHeaderProps) {
    const [localFilters, setLocalFilters] = useState<FilterSchedule>(filters)

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    useEffect(() => {
        // debounce 1s
        const timer = setTimeout(() => {
            if (
                localFilters.origin !== filters.origin ||
                localFilters.destination !== filters.destination ||
                localFilters.date !== filters.date
            ) {
                onSearchChange(localFilters)
            }
        }, 1000)

        // Cleanup function: Xóa timer cũ nếu người dùng gõ tiếp trước khi hết 500ms
        return () => clearTimeout(timer)
    }, [localFilters, onSearchChange, filters])

    return (
        <header className="bg-white border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Điểm đi
                        </label>
                        <Input
                            placeholder="Nhập điểm đi"
                            value={localFilters.origin}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    origin: e.target.value,
                                })
                            }
                            className="bg-muted"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Điểm đến
                        </label>
                        <Input
                            placeholder="Nhập điểm đến"
                            value={localFilters.destination}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    destination: e.target.value,
                                })
                            }
                            className="bg-muted"
                        />
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Ngày đi
                        </label>
                        <Input
                            type="date"
                            value={localFilters.date}
                            onChange={(e) =>
                                setLocalFilters({
                                    ...localFilters,
                                    date: e.target.value,
                                })
                            }
                            className="bg-muted"
                        />
                    </div>

                    {/* <div className="flex items-end">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Tìm kiếm
                        </Button>
                    </div> */}
                </div>
            </div>
        </header>
    )
}
