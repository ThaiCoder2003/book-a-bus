import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Star } from "lucide-react";

export default function UserProfile() {
  return (
    <Card className="shadow-sm border-none ring-1 ring-slate-200">
      <CardContent className="p-5 space-y-5">
        {/* Phần thông tin cơ bản: Avatar + Text nằm ngang */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-blue-50">
            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <h3 className="text-base font-bold text-slate-900">User</h3>
            <p className="text-xs text-slate-500">user@vexere.com</p>
            <p className="text-xs text-slate-500">0123 456 789</p>
          </div>
        </div>

        {/* Ngăn cách nhẹ bằng đường kẻ ngang */}
        <div className="h-px bg-slate-100 w-full" />

        {/* Phần Điểm thưởng: Background xanh nhạt */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#0064D2]">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-500 leading-tight">
                Điểm thưởng
              </p>
              <p className="text-lg font-bold text-[#0064D2] leading-tight ">
                2,450
              </p>
            </div>
          </div>
          <Button
            variant="link"
            className="text-[#0064D2] text-xs font-semibold p-0 h-auto cursor-pointer"
          >
            Đổi quà
          </Button>
        </div>

        {/* Nút chỉnh sửa hồ sơ */}
        <Button
          variant="outline"
          className="w-full justify-center gap-2 text-ms font-medium border-slate-200 bg-white cursor-pointer hover:bg-[#EAF4FF] hover:text-[#0064D2] hover:border-[#C2DFFF] h-9 rounded-lg active:scale-[0.98]"
        >
          <Settings className="h-3.5 w-3.5" />
          Chỉnh sửa hồ sơ
        </Button>
      </CardContent>
    </Card>
  );
}
