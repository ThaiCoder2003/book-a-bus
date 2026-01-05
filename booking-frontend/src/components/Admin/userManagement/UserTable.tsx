import { type FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import UserActionsMenu from "./UserActionsMenu";
import UserDetailModal from "./UserDetailModal";
import UserEditModal from "./UserEditModal";
import Pagination from "../ui/Pagination";

// ✅ Dùng type chung
import type { User } from "../../../types/admin/user";
import userService from "@/services/userService";
import { toast } from "react-toastify";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  totalUser: number;
  onUpdateUser: (user: User) => void;
  currentPage: number;
  onPageChange: (page: number) => void; // Hàm callback
}

const UserTable: FC<UserTableProps> = ({ users, isLoading, totalUser, onUpdateUser, currentPage, onPageChange }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const itemsPerPage = 10;

  const handleSelectedUser = async(id: string) => {
    setLoadingId(id);
    try {
      const user = await userService.getUserById(id);
      setSelectedUser(user);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
    } finally {
      setLoadingId(null);
    }
  }

  const handleSave = async(updatedUser: User, password: string, isResetPassword?: boolean) => {
    setLoadingId(updatedUser.id);
    try {
// 1. Chỉ lấy những field cần update để gửi đi
      const updatePayload = {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      };

      // 2. Cập nhật thông tin cơ bản
      const updatedInfo = await userService.updateUserById(updatedUser.id, updatePayload);

      // 3. Khởi tạo dữ liệu cuối cùng bằng cách trộn dữ liệu cũ + dữ liệu vừa update
      // Việc này giữ lại các field như totalSpent, orders không bị mất
      let finalUserData = { ...updatedUser, ...updatedInfo };

      // 4. Nếu có Reset mật khẩu
      if (isResetPassword) {
        const resetInfo = await userService.resetPassword(updatedUser.id, password);
        // Tiếp tục trộn để đảm bảo không mất field nào
        finalUserData = { ...finalUserData, ...resetInfo };
        toast.success(`Đã reset mật khẩu thành công về: ${password}`);
      }

      // 5. Cập nhật state ở Cha
      onUpdateUser(finalUserData);
      setEditOpen(false);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      toast.error("Cập nhật thất bại, vui lòng kiểm tra lại!");
    } finally {
      setLoadingId(null);
    }
  }


  return (
    <div className="relative border rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}


      <Table key={currentPage}>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Số đơn</TableHead>
            <TableHead>Tổng chi tiêu</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>#{user.id.slice(0, 8)}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.orders}</TableCell>
              <TableCell>{user.totalSpent?.toLocaleString()} ₫</TableCell>
              <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("vi-VN") : "---"}</TableCell>
              <TableCell>
                <UserActionsMenu
                  isLoading={loadingId === user.id}
                  onView={async () => {
                    await handleSelectedUser(user.id)
                    setDetailOpen(true);
                  }}
                  onEdit={async () => {
                    await handleSelectedUser(user.id)
                    setEditOpen(true);
                  }}
                  onDisable={() => alert(`Vô hiệu hóa ${user.name}`)}
                  onDelete={() => alert(`Xóa ${user.name}`)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        totalItems={totalUser}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />

      {selectedUser && (
        <>
          <UserDetailModal
            open={detailOpen}
            onClose={() => setDetailOpen(false)}
            user={selectedUser}
          />
          <UserEditModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            user={selectedUser}
            onSave={handleSave}
          />
        </>
      )}
    </div>
    
  );
};

export default UserTable;
