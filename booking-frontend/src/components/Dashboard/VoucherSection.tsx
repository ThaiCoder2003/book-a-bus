import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export default function VoucherSection() {
  const vouchers = [
    {
      code: "VEXERE50",
      desc: "Giảm 50.000đ",
      min: "Đơn tối thiểu: 200.000đ",
      exp: "15/12/2025",
    },
    {
      code: "DALAT30",
      desc: "Giảm 30%",
      min: "Đơn tối thiểu: 300.000đ",
      exp: "20/12/2025",
    },
    {
      code: "FREESHIP",
      desc: "Giảm Miễn phí",
      min: "Đơn tối thiểu: 100.000đ",
      exp: "31/12/2025",
    },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Mã giảm giá của bạn
        </CardTitle>
        <Button variant="link" className="text-primary text-sm cursor-pointer">
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((v, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors space-y-2"
          >
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <p className="font-semibold text-sm">{v.code}</p>
            </div>
            <p className="text-sm text-muted-foreground">{v.desc}</p>
            <p className="text-xs text-muted-foreground">{v.min}</p>
            <p className="text-xs text-muted-foreground">HSD: {v.exp}</p>
            <Button
              size="sm"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white mt-2 cursor-pointer"
            >
              Sử dụng ngay
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
