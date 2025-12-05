'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchHeaderProps {
    searchParams: {
        origin: string
        destination: string
        date: string
    }
    onSearchChange: (params: any) => void
}

export default function SearchHeader({
    searchParams,
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
                            value={searchParams.origin}
                            onChange={(e) =>
                                onSearchChange({
                                    ...searchParams,
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
                            value={searchParams.destination}
                            onChange={(e) =>
                                onSearchChange({
                                    ...searchParams,
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
                            value={searchParams.date}
                            onChange={(e) =>
                                onSearchChange({
                                    ...searchParams,
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
