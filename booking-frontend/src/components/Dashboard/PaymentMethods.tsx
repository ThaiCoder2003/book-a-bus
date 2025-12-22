import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";

export default function PaymentMethods() {
  const methods = [
    { type: "Visa", number: "**** 4532", exp: "12/26", default: true },
    { type: "MoMo", number: "0123***789", exp: "", default: false },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Phương thức thanh toán
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4 " /> Thêm mới
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {methods.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  {m.type} {m.number}
                </p>
                {m.exp && (
                  <p className="text-xs text-muted-foreground">
                    Hết hạn: {m.exp}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {m.default && (
                <span className="text-xs text-green-600 font-medium">
                  Mặc định
                </span>
              )}
              <Button
                variant="link"
                size="sm"
                className="text-sm cursor-pointer"
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
