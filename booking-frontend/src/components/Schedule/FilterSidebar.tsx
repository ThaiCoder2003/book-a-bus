import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { Dispatch, SetStateAction } from 'react'
import type { FilterSchedule } from '@/types/filterSchedule'

interface FilterSidebarProps {
    filters: FilterSchedule
    onFiltersChange: Dispatch<SetStateAction<FilterSchedule>>
}

export default function FilterSidebar({
    filters,
    onFiltersChange,
}: FilterSidebarProps) {
    const busTypes = ['Ghế ngồi', 'Giường đơn', 'Giường đôi']
    const timeRanges = [
        { id: 'morning', label: 'Sáng (6:00 - 12:00)' },
        { id: 'afternoon', label: 'Chiều (12:00 - 18:00)' },
        { id: 'evening', label: 'Tối (18:00 - 00:00)' },
        { id: 'night', label: 'Đêm (00:00 - 6:00)' },
    ]

    const handleBusTypeChange = (type: string) => {
        const newBusTypes = filters.busType.includes(type)
            ? filters.busType.filter((t) => t !== type)
            : [...filters.busType, type]
        onFiltersChange({ ...filters, busType: newBusTypes })
    }

    const handleTimeChange = (time: string) => {
        const newTimes = filters.departureTime.includes(time)
            ? filters.departureTime.filter((t) => t !== time)
            : [...filters.departureTime, time]
        onFiltersChange({ ...filters, departureTime: newTimes })
    }

    const handleSortChange = (sortBy: string) => {
        onFiltersChange({
            ...filters,
            sortBy: sortBy,
        })
    }

    return (
        <aside className="w-64 shrink-0">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-8">
                {/* Sort */}
                <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3">
                        Sắp xếp
                    </h3>
                    <Select
                        value={filters.sortBy}
                        onValueChange={handleSortChange}
                    >
                        <SelectTrigger className="bg-muted">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price-low">
                                Giá thấp nhất
                            </SelectItem>
                            <SelectItem value="price-high">
                                Giá cao nhất
                            </SelectItem>
                            <SelectItem value="duration">
                                Thời gian ngắn nhất
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bus Type Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3">
                        Loại xe
                    </h3>
                    <div className="space-y-3">
                        {busTypes.map((type) => (
                            <div key={type} className="flex items-center gap-2">
                                <Checkbox
                                    id={type}
                                    checked={filters.busType.includes(type)}
                                    onCheckedChange={() =>
                                        handleBusTypeChange(type)
                                    }
                                />
                                <label
                                    htmlFor={type}
                                    className="text-sm text-foreground cursor-pointer"
                                >
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Departure Time Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3">
                        Thời gian khởi hành
                    </h3>
                    <div className="space-y-3">
                        {timeRanges.map((range) => (
                            <div
                                key={range.id}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    id={range.id}
                                    checked={filters.departureTime.includes(
                                        range.id,
                                    )}
                                    onCheckedChange={() =>
                                        handleTimeChange(range.id)
                                    }
                                />
                                <label
                                    htmlFor={range.id}
                                    className="text-sm text-foreground cursor-pointer"
                                >
                                    {range.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reset Button */}
                <Button
                    variant="outline"
                    className="w-full mt-6 border-border text-foreground hover:bg-muted bg-transparent"
                    onClick={() => {
                        onFiltersChange({
                            origin: '',
                            destination: '',
                            date: '',
                            busType: [],
                            departureTime: [],
                            sortBy: 'duration',
                        })
                    }}
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </aside>
    )
}
