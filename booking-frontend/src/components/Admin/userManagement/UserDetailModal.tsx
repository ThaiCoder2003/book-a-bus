import { type FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";

// ✅ Import kiểu dùng chung
import type { User } from "../../../types/admin/user";

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Đã xác nhận":
      return "bg-green-100 text-green-700";
    case "Chờ xử lý":
      return "bg-yellow-100 text-yellow-700";
    case "Đã hủy":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const UserDetailModal: FC<UserDetailModalProps> = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết người dùng</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4 text-sm">
          {/* --- Thông tin cá nhân --- */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-base mb-2">Thông tin cá nhân</h3>
            <div className="grid grid-cols-2 gap-y-1">
              <p>
                <span className="font-medium">Họ và tên:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span> {user.phone}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
                <Badge
                  variant="outline"
                  className={
                    user.status === "Hoạt động"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }
                >
                  {user.status}
                </Badge>
              </p>
              <p>
                <span className="font-medium">Ngày tạo:</span> {user.createdAt}
              </p>
            </div>
          </div>

          {/* --- Thống kê hoạt động --- */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-base mb-2">Thống kê hoạt động</h3>
            <div className="flex items-center gap-10">
              <div>
                <p className="text-gray-600 text-sm">Tổng số đơn đặt vé</p>
                <p className="text-blue-600 font-semibold text-lg">
                  {user.orders}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Tổng tiền chi tiêu</p>
                <p className="text-green-600 font-semibold text-lg">
                  {user.totalSpent.toLocaleString("vi-VN")} ₫
                </p>
              </div>
            </div>
          </div>

          {/* --- Lịch sử đặt vé --- */}
          <div className="border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-base mb-2">Lịch sử đặt vé</h3>
            <div className="max-h-72 overflow-y-auto pr-1 space-y-3">
              {user.bookingHistory?.length ? (
                user.bookingHistory.map((booking) => (
                  <div
                    key={booking.id}
                    className="border rounded-md p-3 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">Mã đơn: {booking.id}</p>
                      <Badge
                        className={`${getStatusColor(booking.status)} text-xs`}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600">
                      <span className="font-medium">Đặt lúc:</span>{" "}
                      {booking.date}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Dịch vụ:</span>{" "}
                      {booking.service}
                    </p>
                    <p className="text-green-600 font-semibold mt-1">
                      Tổng tiền: {booking.amount.toLocaleString("vi-VN")} ₫
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Chưa có lịch sử đặt vé.</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
