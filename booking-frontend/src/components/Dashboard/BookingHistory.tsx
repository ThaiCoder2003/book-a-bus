import { CheckCircle2, Clock, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function BookingHistory() {
  const history = [
    {
      id: 1,
      date: "10/11/2025",
      route: "Sài Gòn → Vũng Tàu",
      status: "Hoàn thành",
      price: "180.000đ",
    },
    {
      id: 2,
      date: "01/11/2025",
      route: "Vũng Tàu → Sài Gòn",
      status: "Hoàn thành",
      price: "180.000đ",
    },
    {
      id: 3,
      date: "15/10/2025",
      route: "Sài Gòn → Cần Thơ",
      status: "Đã hủy",
      price: "160.000đ",
    },
    {
      id: 4,
      date: "05/10/2025",
      route: "Cần Thơ → Sài Gòn",
      status: "Hoàn thành",
      price: "160.000đ",
    },
  ];

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
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <p className="font-medium text-sm">{item.route}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {item.date}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      item.status === "Hoàn thành" ? "secondary" : "outline"
                    }
                    className={
                      item.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "text-muted-foreground"
                    }
                  >
                    {item.status === "Hoàn thành" && (
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                    )}
                    {item.status}
                  </Badge>
                  <span className="text-xs font-medium">{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
