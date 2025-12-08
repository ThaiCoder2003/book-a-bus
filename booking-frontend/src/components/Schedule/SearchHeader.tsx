import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Dispatch, SetStateAction } from 'react'
import type { FilterSchedule } from '@/types/filterSchedule'

interface SearchHeaderProps {
    filters: FilterSchedule
    onSearchChange: Dispatch<SetStateAction<FilterSchedule>>
}

export default function SearchHeader({
    filters,
    onSearchChange,
}: SearchHeaderProps) {
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
                            value={filters.origin}
                            onChange={(e) =>
                                onSearchChange({
                                    ...filters,
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
                            value={filters.destination}
                            onChange={(e) =>
                                onSearchChange({
                                    ...filters,
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
                            value={filters.date}
                            onChange={(e) =>
                                onSearchChange({
                                    ...filters,
                                    date: e.target.value,
                                })
                            }
                            className="bg-muted"
                        />
                    </div>

                    <div className="flex items-end">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
