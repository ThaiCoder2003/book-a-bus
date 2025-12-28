import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface PromotionCardProps {
  promo: {
    id: number;
    code: string;
    title: string;
    description: string;
    discount: string;
    expireDate: string;
    minPrice: number;
    tag?: string;
    used: number;
    total: number;
  };
  onCopy: (code: string) => void;
  isSaved: boolean;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  promo,
  onCopy,
  isSaved,
}) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Ticket className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm">{promo.code}</h3>
        </div>
        {promo.tag && (
          <span className="text-xs font-medium text-muted-foreground uppercase">
            {promo.tag}
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p className="font-semibold text-base text-primary">{promo.title}</p>
        <p>{promo.description}</p>
        <p>Tối thiểu: {promo.minPrice.toLocaleString()}đ</p>
        <p>HSD: {new Date(promo.expireDate).toLocaleDateString("vi-VN")}</p>

        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-2 bg-primary"
            style={{ width: `${(promo.used / promo.total) * 100}%` }}
          ></div>
        </div>

        <Button
          size="sm"
          onClick={() => onCopy(promo.code)}
          className={`w-full mt-3 text-white ${
            isSaved
              ? "bg-green-500 hover:bg-green-600"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isSaved ? "Đã lưu" : "Sao chép"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PromotionCard;
