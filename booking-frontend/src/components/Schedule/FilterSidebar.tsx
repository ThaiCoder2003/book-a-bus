import { Button } from '@/components/ui/button'
// Đã xóa import Checkbox vì không dùng nữa
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
    const seatTypes = [
        { key: 'SEAT', value: 'Ghế ngồi' },
        { key: 'VIP', value: 'Ghế ngồi VIP' },
        { key: 'SINGLE_BED', value: 'Giường đơn' },
        { key: 'DOUBLE_BED', value: 'Giường đôi' },
        { key: 'ALL', value: 'Tất cả' }
    ]

    const timeRanges = [
        { id: 'morning', label: 'Sáng (6:00 - 11:59)' },
        { id: 'afternoon', label: 'Chiều (12:00 - 17:59)' },
        { id: 'evening', label: 'Tối (18:00 - 23:59)' },
        { id: 'night', label: 'Đêm (00:00 - 5:59)' },
        { id: 'all', label: 'Cả ngày' },
    ]

    // Xử lý chọn loại xe (String)
    const handleBusTypeChange = (type: string) => {
        // Nếu đang chọn cái này rồi thì bỏ chọn (thành rỗng), ngược lại thì chọn nó
        const newValue = filters.seatType === type ? '' : type
        onFiltersChange({ ...filters, seatType: newValue })
    }

    // Xử lý chọn giờ (String)
    const handleTimeChange = (time: string) => {
        const newValue = filters.departureTime === time ? '' : time
        onFiltersChange({ ...filters, departureTime: newValue })
    }

    const handleSortChange = (sortBy: string) => {
        onFiltersChange({ ...filters, sortBy })
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
                            <SelectItem value="pickupTime_desc">
                                Xuất phát sớm nhất
                            </SelectItem>
                            <SelectItem value="arrivalTime_desc">
                                Đến nơi sớm nhất
                            </SelectItem>
                            <SelectItem value="price_asc">
                                Giá tăng dần
                            </SelectItem>
                            <SelectItem value="price_desc">
                                Giá giảm dần
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Bus Type Filter (Radio Logic) */}
                <div className="mb-6 pb-6 border-b border-border">
                    <h3 className="font-semibold text-foreground mb-3">
                        Loại xe
                    </h3>
                    <div className="space-y-3">
                        {seatTypes.map((type) => (
                            <label
                                key={type.key}
                                className="flex items-center gap-2 cursor-pointer group"
                            >
                                <input
                                    type="radio"
                                    name="seatType" // Group radio lại với nhau
                                    className="w-4 h-4 accent-primary cursor-pointer"
                                    checked={filters.seatType === type.key}
                                    // Dùng onClick để có thể xử lý logic toggle (bỏ chọn)
                                    onClick={() =>
                                        handleBusTypeChange(type.key)
                                    }
                                    readOnly // Tránh warning của React khi dùng checked mà không có onChange (đã xử lý ở onClick)
                                />
                                <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                    {type.value}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Departure Time Filter (Radio Logic) */}
                <div className="mb-6 pb-6 border-b border-border">
                    {!filters.date && (
                        <p className="text-red-500 text-sm mb-2 italic">
                            * Vui lòng chọn ngày đi trước
                        </p>
                    )}

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
                                <label
                                    key={range.id}
                                    className="flex items-center gap-2 cursor-pointer group"
                                >
                                    <input
                                        type="radio"
                                        name="departureTime" // Group radio
                                        className="w-4 h-4 accent-primary cursor-pointer"
                                        disabled={!filters.date}
                                        checked={
                                            filters.departureTime === range.id
                                        }
                                        onClick={() =>
                                            handleTimeChange(range.id)
                                        }
                                        readOnly
                                    />
                                    <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                                        {range.label}
                                    </span>
                                </label>
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
                            date: '', // Cẩn thận chỗ này nếu bạn muốn giữ lại ngày đang chọn
                            seatType: '', // Reset về string rỗng
                            departureTime: '', // Reset về string rỗng
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
