import { type FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { Eye, EyeOff, RefreshCcw } from "lucide-react";

// ✅ Import type User dùng chung
import type { User } from "../../../types/admin/user";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSave: (
    updatedUser: Partial<User> & {
      password?: string;
      requireChange?: boolean;
      sendEmail?: boolean;
    },
  ) => void;
}

const UserEditModal: FC<UserEditModalProps> = ({
  open,
  onClose,
  user,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [status] = useState(user.status);
  const [orders, setOrders] = useState(user.orders);
  const [total, setTotal] = useState(user.totalSpent);
  const [changePassword, setChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requireChange, setRequireChange] = useState(false);
  const [sendEmail, setSendEmail] = useState(false);

  const passwordStrength =
    password.length >= 8
      ? /[A-Z]/.test(password) && /[0-9]/.test(password)
        ? "Mạnh"
        : "Trung bình"
      : "Yếu";

  const generateRandomPassword = (length = 10) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
  };

  const handleGeneratePassword = () => {
    const pass = generateRandomPassword();
    setPassword(pass);
    navigator.clipboard.writeText(pass);
  };

  const handleSave = () => {
    onSave({
      name,
      email,
      phone,
      status,
      orders,
      totalSpent: total,
      password: changePassword ? password : undefined,
      requireChange,
      sendEmail,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg w-full rounded-xl shadow-lg p-6 bg-white"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          position: "fixed",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Chỉnh sửa người dùng
          </DialogTitle>
        </DialogHeader>

        {/* Form chỉnh sửa */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-3">
          <div>
            <Label>Họ và tên</Label>
            <Input
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              className="mt-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label>Số điện thoại</Label>
            <Input
              className="mt-1"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label>Trạng thái</Label>
            <Input className="mt-1" value={status} disabled />
          </div>

          <div>
            <Label>Số đơn đặt vé</Label>
            <Input
              className="mt-1"
              type="number"
              value={orders}
              onChange={(e) => setOrders(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Tổng chi tiêu (VND)</Label>
            <Input
              className="mt-1"
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Đổi mật khẩu */}
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={changePassword}
              onChange={() => setChangePassword(!changePassword)}
            />
            Đổi mật khẩu
          </label>

          {changePassword && (
            <div className="rounded-md border bg-gray-50 p-4 space-y-3">
              <div>
                <Label>Mật khẩu mới</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    variant="outline"
                    className="shrink-0"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                  <Button
                    onClick={handleGeneratePassword}
                    variant="outline"
                    className="shrink-0 flex items-center gap-1 whitespace-nowrap"
                  >
                    <RefreshCcw size={14} />
                    <span>Tạo ngẫu nhiên</span>
                  </Button>
                </div>
              </div>

              {password && (
                <p className="text-sm">
                  Độ mạnh mật khẩu:{" "}
                  <span
                    className={
                      passwordStrength === "Mạnh"
                        ? "text-green-600"
                        : passwordStrength === "Trung bình"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }
                  >
                    {passwordStrength}
                  </span>
                </p>
              )}

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={requireChange}
                  onChange={() => setRequireChange(!requireChange)}
                />
                Yêu cầu đổi mật khẩu khi đăng nhập lần tiếp theo
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={() => setSendEmail(!sendEmail)}
                />
                Gửi email thông báo thay đổi mật khẩu
              </label>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserEditModal;
