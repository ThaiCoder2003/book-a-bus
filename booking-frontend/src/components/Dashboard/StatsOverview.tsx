import { Card, CardContent } from "@/components/ui/card";
import { Ticket, TrendingUp, Gift } from "lucide-react";

export default function StatsOverview() {
  const stats = [
    {
      icon: Ticket,
      label: "Tổng chuyến đi",
      value: "35",
      bgColor: "bg-[#E8F3FF]",
      iconColor: "text-[#0064D2]",
    },
    {
      icon: TrendingUp,
      label: "Tổng chi tiêu",
      value: "6.3M",
      bgColor: "bg-[#D1F2EB]",
      iconColor: "text-[#1ABC9C]",
    },
    {
      icon: Gift,
      label: "Mã giảm giá",
      value: "3",
      bgColor: "bg-[#E5F1E5]",
      iconColor: "text-[#27AE60]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((s, i) => (
        <Card
          key={i}
          className="border-none ring-1 ring-slate-200 shadow-sm rounded-2xl overflow-hidden"
        >
          <CardContent className="flex items-center p-6 gap-4">
            {/* Khối chứa Icon với màu nền riêng biệt */}
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${s.bgColor}`}
            >
              <s.icon className={`h-7 w-7 ${s.iconColor} stroke-[2px]`} />
            </div>

            {/* Nội dung text căn trái */}
            <div className="flex flex-col text-left">
              <p className="text-sm font-medium text-slate-500 leading-tight">
                {s.label}
              </p>
              <p className="text-[28px] font-bold text-slate-900 leading-tight mt-1">
                {s.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
