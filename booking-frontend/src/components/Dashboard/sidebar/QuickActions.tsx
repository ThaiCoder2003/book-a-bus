import { Card, CardContent } from "@/components/ui/card";
import { Plus, RotateCcw, Printer, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  const actions = [
    { icon: Plus, label: "Đặt vé mới" },
    { icon: RotateCcw, label: "Đặt lại chuyến cũ" },
    { icon: Printer, label: "In vé" },
    { icon: Mail, label: "Gửi vé qua email" },
  ];

  return (
    <Card className="shadow-sm border-none ring-1 ring-slate-200 rounded-2xl overflow-hidden">
      <CardContent className="px-5 pt-4 pb-1">
        {/* Tiêu đề */}
        <h3 className="text-base font-bold text-slate-900 leading-none mb-8">
          Thao tác nhanh
        </h3>

        <div className="space-y-1.5">
          {actions.map((a, i) => (
            <Button
              key={i}
              variant="outline"
              className="
                w-full justify-start text-sm font-medium h-9 px-3 border-slate-200 bg-white cursor-pointer rounded-lg transition-all duration-200 hover:bg-[#EAF4FF] hover:text-[#0064D2] hover:border-[#C2DFFF]
                active:scale-[0.98] group
              "
            >
              {/* Icon thanh mảnh */}
              <a.icon className="h-4 w-4 mr-2.5 stroke-[1.5px] text-slate-600 group-hover:text-[#0064D2]" />
              <span className="text-slate-700 group-hover:text-[#0064D2]">
                {a.label}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
