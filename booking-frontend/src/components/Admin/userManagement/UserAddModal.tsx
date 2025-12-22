import { type FC, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogCloseButton,
} from "../ui/dialog";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { Eye, EyeOff } from "lucide-react";

// Định nghĩa kiểu dữ liệu cụ thể thay vì dùng 'any'
interface UserData {
  name: string;
  email: string;
  phone: string;
  username: string;
  password: string;
  sendEmail: boolean;
  requireChange: boolean;
}

interface UserAddModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: UserData) => void; // Thay 'any' bằng UserData
}

const generateRandomPassword = (length = 10) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

const UserAddModal: FC<UserAddModalProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [requireChange, setRequireChange] = useState(true);

  const passwordStrength =
    password.length >= 8
      ? /[A-Z]/.test(password) && /[0-9]/.test(password)
        ? "Mạnh"
        : "Trung bình"
      : "Yếu";

  const canSubmit = useMemo(
    () => name.trim() && email.trim() && phone.trim() && password.trim(),
    [name, email, phone, password],
  );

  const handleGeneratePassword = () => {
    const pass = generateRandomPassword();
    setPassword(pass);
    navigator.clipboard.writeText(pass);
  };

  const handleAdd = () => {
    if (!canSubmit) return;
    onAdd({
      name,
      email,
      phone,
      username,
      password,
      sendEmail,
      requireChange,
    });
    onClose();
    setName("");
    setEmail("");
    setPhone("");
    setUsername("");
    setPassword("");
    setSendEmail(true);
    setRequireChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="relative">
          <div>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              Điền thông tin để tạo tài khoản người dùng mới
            </p>
          </div>
          <DialogCloseButton onClick={onClose} />
        </DialogHeader>

        <div className="space-y-6 mt-2">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="nguyenvana@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="0901234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* CẬP NHẬT SHADOW TẠI ĐÂY */}
          <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-md space-y-3 relative">
            <h3 className="font-medium text-gray-700">Thông tin đăng nhập</h3>

            <div>
              <Label>Tên đăng nhập (tùy chọn)</Label>
              <Input
                placeholder="user_nguyenvana"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Nếu bỏ trống, hệ thống sẽ dùng Email làm tên đăng nhập
              </p>
            </div>

            <div>
              <Label>
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  variant="outline"
                  type="button"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={handleGeneratePassword}
                  variant="outline"
                  type="button"
                >
                  Tạo ngẫu nhiên
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và
                số
              </p>
              <p className="text-sm mt-1">
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
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={() => setSendEmail(!sendEmail)}
                  className="rounded border-gray-300"
                />
                Gửi thông tin đăng nhập tới Email người dùng
              </label>

              <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-blue-600 transition">
                <input
                  type="checkbox"
                  checked={requireChange}
                  onChange={() => setRequireChange(!requireChange)}
                  className="rounded border-gray-300"
                />
                Bắt buộc đổi mật khẩu trong lần đầu đăng nhập
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!canSubmit}
            className={!canSubmit ? "opacity-50 cursor-not-allowed" : ""}
          >
            Thêm người dùng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserAddModal;
