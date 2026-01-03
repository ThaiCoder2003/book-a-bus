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

const password = 'Password123!'

// ✅ Import type User dùng chung
import type { User } from "../../../types/admin/user";

interface UserEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: User, password: string, isResetPassword?: boolean) => Promise<void>;
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
  const [changePassword, setChangePassword] = useState(false);


  const handleSave = () => {
    onSave({ 
        ...user, // Giữ lại ID và các field cũ
        name, 
        email, 
        phone 
      }, 
      password,        // Tham số thứ 2: password mặc định ('Password123!')
      changePassword);
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

        </div>

        {/* Đổi mật khẩu */}
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              checked={changePassword}
              onChange={() => setChangePassword(!changePassword)}
            />
            Reset mật khẩu
          </label>
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
