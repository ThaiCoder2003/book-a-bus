import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Star, Save, X } from "lucide-react";
import type { User } from '@/types/user.type'
import { toast } from "react-toastify";

interface UserProfileProps {
  user: User | null; // Có thể null khi đang load
  isLoading: boolean;
  onEdit: (payload: any) => void
}

export default function UserProfile({ user, isLoading, onEdit }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }

    toggleEdit()
  }

  const saveProfile = async () => {
    try {
      await onEdit(profile)

      toggleEdit()
    }

    catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      toast.error("Cập nhật thất bại, vui lòng kiểm tra lại!");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 border animate-pulse">
        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    )
  }

  return (
    <Card className="shadow-sm border-none ring-1 ring-slate-200">
      <CardContent className="p-5 space-y-5">
        {/* Basic Info: Avatar + Text or Inputs */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-blue-50">
            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="text-left">
            {isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="text-base font-bold text-slate-900 border rounded p-1 w-full"
                />
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="text-xs text-slate-500 border rounded p-1 w-full mt-1"
                />
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                  className="text-xs text-slate-500 border rounded p-1 w-full mt-1"
                />
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-slate-900">
                  {profile.name}
                </h3>
                <p className="text-xs text-slate-500">{profile.email}</p>
                <p className="text-xs text-slate-500">{profile.phone}</p>
              </>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 w-full" />

        {/* Reward Points */}
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

        {/* Edit or Save Profile Button */}
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={isEditing ? saveProfile : toggleEdit}
          className="w-full justify-center gap-2 text-ms font-medium border-slate-200 bg-white cursor-pointer hover:bg-[#EAF4FF] hover:text-[#0064D2] hover:border-[#C2DFFF] h-9 rounded-lg active:scale-[0.98]"
        >
          {isEditing ? (
            <>
              <Save className="h-3.5 w-3.5" /> Lưu hồ sơ
            </>
          ) : (
            <>
              <Settings className="h-3.5 w-3.5" /> Chỉnh sửa hồ sơ
            </>
          )}
        </Button>

        {/* Cancel Button in Edit Mode */}
        {isEditing && (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full justify-center gap-2 text-ms font-medium border-slate-200 bg-white cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 h-9 rounded-lg active:scale-[0.98] mt-2"
          >
            <X className="h-3.5 w-3.5" /> Hủy bỏ
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
