import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'

export function BookingSummary({ selectedSeats, pricePerSeat }) {
    const totalPrice = selectedSeats.length * pricePerSeat

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle>Thông tin đặt vé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Selected Seats */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Ghế đã chọn</span>
                        <Badge
                            variant={
                                selectedSeats.length > 0
                                    ? 'default'
                                    : 'secondary'
                            }
                        >
                            {selectedSeats.length} ghế
                        </Badge>
                    </div>
                    {selectedSeats.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedSeats.map((seat) => (
                                <Badge
                                    key={seat}
                                    variant="outline"
                                    className="text-base font-semibold"
                                >
                                    {seat}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Chưa chọn ghế nào
                        </p>
                    )}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Giá vé ({selectedSeats.length} ghế)
                        </span>
                        <span className="font-medium">
                            {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            Phí dịch vụ
                        </span>
                        <span className="font-medium">0đ</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="font-semibold">Tổng cộng</span>
                        <span className="text-xl font-bold text-primary">
                            {totalPrice.toLocaleString('vi-VN')}đ
                        </span>
                    </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-2">
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={selectedSeats.length === 0}
                    >
                        <User className="mr-2 h-4 w-4" />
                        Tiếp tục đặt vé
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        Bằng việc tiếp tục, bạn đồng ý với điều khoản sử dụng
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default BookingSummary
