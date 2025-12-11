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
    const busTypes = [
        {
            key: 'SEAT',
            value: 'Ghế ngồi',
        },
        {
            key: 'SINGLE_BED',
            value: 'Giường đơn',
        },
        {
            key: 'DOUBLE_BED',
            value: 'Giường đôi',
        },
    ]
    const timeRanges = [
        { id: 'morning', label: 'Sáng (6:00 - 11:59)' },
        { id: 'afternoon', label: 'Chiều (12:00 - 17:59)' },
        { id: 'evening', label: 'Tối (18:00 - 23:59)' },
        { id: 'night', label: 'Đêm (00:00 - 5:59)' },
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
                            <SelectItem value="departure-time">
                                Xuất phát sớm nhất
                            </SelectItem>
                            <SelectItem value="arrival-time">
                                Đến nơi sớm nhất
                            </SelectItem>
                            <SelectItem value="price-low">
                                Giá tăng dần
                            </SelectItem>
                            <SelectItem value="price-high">
                                Giá giảm dần
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
                            <div key={type.key} className="flex items-center gap-2">
                                <Checkbox
                                    id={type.key}
                                    checked={filters.busType.includes(type.key)}
                                    onCheckedChange={() =>
                                        handleBusTypeChange(type.key)
                                    }
                                />
                                <label
                                    htmlFor={type.key}
                                    className="text-sm text-foreground cursor-pointer"
                                >
                                    {type.value}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Departure Time Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                    {/* 1. Logic hiển thị cảnh báo: Nếu chưa có ngày thì hiện chữ đỏ */}
                    {!filters.date && (
                        <p className="text-red-500 text-sm mb-2 italic">
                            * Vui lòng chọn ngày đi trước
                        </p>
                    )}

                    {/* 2. Logic làm mờ và chặn click: Nếu chưa có ngày thì thêm class */}
                    <div
                        className={
                            !filters.date
                                ? 'opacity-50 pointer-events-none select-none'
                                : ''
                        }
                    >
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
                                        // Best practice: Disable luôn input gốc để tránh dùng phím Tab focus vào được
                                        disabled={!filters.date}
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
                            sortBy: 'arrival-time',
                        })
                    }}
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </aside>
    )
}
