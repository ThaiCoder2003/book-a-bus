import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { FilterSchedule } from '@/types/filterSchedule'

interface FilterSidebarProps {
    filters: FilterSchedule
    onFiltersChange: (filters: any) => void
    sortBy: string
    onSortChange: (sort: string) => void
}

export default function FilterSidebar({
    filters,
    onFiltersChange,
    sortBy,
    onSortChange,
}: FilterSidebarProps) {
    const [priceValue, setPriceValue] = useState(5000000)

    const busTypes = ['Ghế ngồi', 'Giường đơn', 'Giường đôi']
    const timeRanges = [
        { id: 'morning', label: 'Sáng (6:00 - 12:00)' },
        { id: 'afternoon', label: 'Chiều (12:00 - 18:00)' },
        { id: 'evening', label: 'Tối (18:00 - 00:00)' },
        { id: 'night', label: 'Đêm (00:00 - 6:00)' },
    ]

    // const amenitiesList = ['WiFi', 'Điều hòa', 'Toilet', 'Ghế massage']

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

    // const handleAmenityChange = (amenity: string) => {
    //     const newAmenities = filters.amenities.includes(amenity)
    //         ? filters.amenities.filter((a) => a !== amenity)
    //         : [...filters.amenities, amenity]
    //     onFiltersChange({ ...filters, amenities: newAmenities })
    // }

    return (
        <aside className="w-64 shrink-0">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-8">
                {/* Sort */}
                <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-3">
                        Sắp xếp
                    </h3>
                    <Select value={sortBy} onValueChange={onSortChange}>
                        <SelectTrigger className="bg-muted">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recommended">
                                Được đề xuất
                            </SelectItem>
                            <SelectItem value="price-low">
                                Giá thấp nhất
                            </SelectItem>
                            <SelectItem value="price-high">
                                Giá cao nhất
                            </SelectItem>
                            <SelectItem value="rating">
                                Đánh giá cao nhất
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

                {/* Price Range Filter */}
                <div className="mb-6 pb-6 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3">
                        Khoảng giá
                    </h3>
                    <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="50000"
                        value={priceValue}
                        onChange={(e) => {
                            setPriceValue(Number.parseInt(e.target.value))
                            onFiltersChange({
                                ...filters,
                                priceRange: [
                                    0,
                                    Number.parseInt(e.target.value),
                                ],
                            })
                        }}
                        className="w-full"
                    />
                    <div className="mt-2 text-sm text-muted-foreground">
                        Tối đa: {priceValue.toLocaleString('vi-VN')}đ
                    </div>
                </div>

                {/* Amenities Filter
                <div>
                    <h3 className="font-semibold text-foreground mb-3">
                        Tiện ích
                    </h3>
                    <div className="space-y-3">
                        {amenitiesList.map((amenity) => (
                            <div
                                key={amenity}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    id={amenity}
                                    checked={filters.amenities.includes(
                                        amenity,
                                    )}
                                    onCheckedChange={() =>
                                        handleAmenityChange(amenity)
                                    }
                                />
                                <label
                                    htmlFor={amenity}
                                    className="text-sm text-foreground cursor-pointer"
                                >
                                    {amenity}
                                </label>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Reset Button */}
                <Button
                    variant="outline"
                    className="w-full mt-6 border-border text-foreground hover:bg-muted bg-transparent"
                    onClick={() => {
                        onFiltersChange({
                            busType: [],
                            priceRange: [0, 5000000],
                            departureTime: [],
                            amenities: [],
                        })
                        setPriceValue(5000000)
                    }}
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </aside>
    )
}
