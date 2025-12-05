import { MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SearchTrip() {
    return (
        <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Bạn muốn đi đâu?
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="origin">Điểm đi</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="origin"
                            placeholder="Nhập điểm đi (VD: Sài Gòn)"
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="destination">Điểm đến</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="destination"
                            placeholder="Nhập điểm đến (VD: Vũng Tàu)"
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button className="cursor-pointer w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold h-11">
                        <Search className="mr-2 h-4 w-4" />
                        Tìm chuyến xe
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
