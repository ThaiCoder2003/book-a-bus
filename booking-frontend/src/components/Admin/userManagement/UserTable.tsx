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

interface UserTableProps {
  users: User[];
  onUpdateUser: (user: User) => void;
}

const UserTable: FC<UserTableProps> = ({ users, onUpdateUser }) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Table key={currentPage}>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>SĐT</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Số đơn</TableHead>
            <TableHead>Tổng chi tiêu</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>#{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>{user.orders}</TableCell>
              <TableCell>{user.totalSpent.toLocaleString()} ₫</TableCell>
              <TableCell>{user.createdAt}</TableCell>
              <TableCell>
                <UserActionsMenu
                  onView={() => {
                    setSelectedUser(user);
                    setDetailOpen(true);
                  }}
                  onEdit={() => {
                    setSelectedUser(user);
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
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
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
            onSave={(updatedUser) => {
              onUpdateUser({ ...selectedUser, ...updatedUser });
              setEditOpen(false);
            }}
          />
        </>
      )}
    </>
  );
};

export default UserTable;
