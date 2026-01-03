import { useState, useEffect } from "react";
import Button from "../../components/Admin/ui/Button";
import UserTable from "../../components/Admin/userManagement/UserTable";
import UserAddModal from "../../components/Admin/userManagement/UserAddModal";
import { Input } from "../../components/Admin/ui/Input";
// FIXED: Removed 'Filter' which was defined but never used
import { Search } from "lucide-react";

import type { User } from "@/types/admin/user";
import userService from "@/services/userService";

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("")
  const [query, setQuery] = useState("");

  const [currentPage, setCurrentPage] = useState<number>(1)

  const [totalUsers, setTotalUsers] = useState<number>(0)

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Nếu có search term thì gọi search, không thì getAll
      const getUsers = await userService.getUsers(query, currentPage)

      setUsers(getUsers.users);
      setTotalUsers(getUsers.total)
    } catch (error) {
      console.error("Failed to fetch routes", error);
    } finally {
      setIsLoading(false); // 🆕 Kết thúc fetch
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchInput);
      setCurrentPage(1); // Reset về trang 1 mỗi khi search cái mới
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, query]);


  // FIXED: Replaced 'any' with Omit<User, 'id' | 'status' | 'createdAt' | 'orders' | 'totalSpent'>
  // This ensures the data coming from the modal matches the required input fields.
  const handleAddUser = (newUser: Pick<User, "name" | "email" | "phone">) => {
    setUsers([
      ...users,
      {
        ...newUser,
        id: (users.length + 1).toString(),
        createdAt: new Date().toISOString().split("T")[0],
        orders: 0,
        totalSpent: 0,
      },
    ]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Người dùng</h1>
          <p className="text-gray-500">
            Quản lý toàn bộ người dùng hệ thống và hoạt động đặt vé
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>+ Thêm người dùng</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-md shadow-sm border">
          <p className="text-gray-600">Tổng người dùng</p>
          <p className="text-2xl font-bold mt-1">{totalUsers}</p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border flex items-center gap-2">
        <div className="flex-1">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="w-full"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </div>

      <UserTable users={users} isLoading={isLoading} totalUser={totalUsers} onUpdateUser={handleUpdateUser} onPageChange={setCurrentPage} currentPage={currentPage} />

      <UserAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};

export default UserManagementPage;
