import { useState, useMemo } from "react";
import Button from "../../components/Admin/ui/Button";
import UserTable from "../../components/Admin/userManagement/UserTable";
import UserAddModal from "../../components/Admin/userManagement/UserAddModal";
import { Input } from "../../components/Admin/ui/Input";
// FIXED: Removed 'Filter' which was defined but never used
import { Search } from "lucide-react";

// Define the structure for Booking History to replace 'any'
interface Booking {
  id: string;
  date: string;
  service: string;
  amount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
  bookingHistory?: Booking[]; // FIXED: Replaced any[] with Booking[]
}

const initialUsers: User[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    email: "a@example.com",
    phone: "0123456789",
    status: "Hoạt động",
    orders: 5,
    totalSpent: 1250000,
    createdAt: "2025-12-01",
  },
  {
    id: "2",
    name: "Trần Thị B",
    email: "b@example.com",
    phone: "0987654321",
    status: "Không hoạt động",
    orders: 2,
    totalSpent: 700000,
    createdAt: "2025-12-05",
  },
];

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [addOpen, setAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Hoạt động").length;
  const inactiveUsers = users.filter((u) => u.status !== "Hoạt động").length;

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm),
    );
  }, [searchTerm, users]);

  // FIXED: Replaced 'any' with Omit<User, 'id' | 'status' | 'createdAt' | 'orders' | 'totalSpent'>
  // This ensures the data coming from the modal matches the required input fields.
  const handleAddUser = (newUser: Pick<User, "name" | "email" | "phone">) => {
    setUsers([
      ...users,
      {
        ...newUser,
        id: (users.length + 1).toString(),
        status: "Hoạt động",
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
        <div className="bg-white p-4 rounded-md shadow-sm border">
          <p className="text-gray-600">Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {activeUsers}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-sm border">
          <p className="text-gray-600">Không hoạt động</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {inactiveUsers}
          </p>
        </div>
      </div>

      <div className="bg-white p-3 rounded-md shadow-sm border flex items-center gap-2">
        <div className="flex-1">
          <Input
            icon={<Search className="w-4 h-4" />}
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <UserTable users={filteredUsers} onUpdateUser={handleUpdateUser} />

      <UserAddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddUser}
      />
    </div>
  );
};

export default UserManagementPage;
