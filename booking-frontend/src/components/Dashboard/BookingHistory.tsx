import { CheckCircle2, Clock, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Booking } from "@/types/booking.type";

interface BookingHistoryProps {
  bookings?: Booking[]; // Đây là user.bookings từ API của bạn
}

export default function BookingHistory({ bookings }: BookingHistoryProps) {

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Lịch sử đặt vé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-60 pr-4">
          <div className="space-y-4">
            {bookings?.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="font-medium text-sm">{item.departureStation?.province} → {item.arrivalStation?.province}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      item.status === 'CONFIRMED' ? "secondary" : "outline"
                    }
                    className={
                      item.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "text-muted-foreground"
                    }
                  >
                    {item.status === "CONFIRMED" && (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    )}
                    {item.status == "CONFIRMED" ? "Hoàn thành" : "Đã hủy"}
                  </Badge>
                  <span className="text-xs font-medium">{item.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
