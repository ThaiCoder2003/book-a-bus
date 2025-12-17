import { useState } from "react";
import BookingTable from "../../components/Admin/bookings/BookingTable";
import FilterSection from "../../components/Admin/bookings/FilterSection";
import BookingDetailModal from "../../components/Admin/bookings/BookingDetailModal";
import { Search, FileSpreadsheet } from "lucide-react"; // ⬅ icon lucide-react

// Định nghĩa kiểu dữ liệu
export interface Booking {
  id: string;
  customer: string;
  route: string;
  departureDate: string;
  totalPrice: string;
  status: "Đã xác nhận" | "Đang chờ" | "Đã hủy";
  paymentStatus: "Đã thanh toán" | "Chưa thanh toán" | "Đã hoàn tiền";
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    customer: "Nguyễn Văn A",
    route: "Hà Nội - TPHCM",
    departureDate: "2024-12-20",
    totalPrice: "850.000 đ",
    status: "Đã xác nhận",
    paymentStatus: "Đã thanh toán",
  },
  {
    id: "BK002",
    customer: "Trần Thị B",
    route: "Hà Nội - Hải Phòng",
    departureDate: "2024-12-15",
    totalPrice: "200.000 đ",
    status: "Đang chờ",
    paymentStatus: "Chưa thanh toán",
  },
  {
    id: "BK003",
    customer: "Lê Văn C",
    route: "TPHCM - Cần Thơ",
    departureDate: "2024-12-18",
    totalPrice: "500.000 đ",
    status: "Đã hủy",
    paymentStatus: "Đã hoàn tiền",
  },
];

const BookingManagementPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [filteredBookings, setFilteredBookings] = useState(mockBookings);

  const handleFilterChange = (filters: any) => {
    let result = [...mockBookings];

    if (filters.status !== "Tất cả") {
      result = result.filter((b) => b.status === filters.status);
    }

    if (filters.payment !== "Tất cả") {
      result = result.filter((b) => b.paymentStatus === filters.payment);
    }

    if (filters.route !== "Tất cả") {
      result = result.filter((b) => b.route === filters.route);
    }

    if (filters.startDate) {
      result = result.filter((b) => b.departureDate >= filters.startDate);
    }

    if (filters.endDate) {
      result = result.filter((b) => b.departureDate <= filters.endDate);
    }

    if (filters.vipOnly) {
      result = result.filter((b) => b.customer.includes("VIP"));
    }

    setFilteredBookings(result);
  };

  const handleOpenModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        {/* Bên trái */}
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">
            Quản lý đặt chỗ
          </h1>
          <p className="text-2x1 text-gray-500 mt-1">
            Tổng: <b>{mockBookings.length}</b> đơn
          </p>
        </div>

        {/* Bên phải - nút Excel */}
        <button
          className="px-4 py-2 text-sm text-black bg-white rounded flex items-center border border-gray-300 hover:bg-blue-900
           hover:text-white hover:shadow-md hover:shadow-blue-200 transition duration-150 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Xuất Excel
        </button>
      </div>
      {/* Thanh tìm kiếm */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div
          className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2
    focus-within:border-blue-800 transition duration-150"
        >
          <Search className="w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Tìm kiếm theo mã vé, tên khách hàng hoặc số điện thoại..."
            className="grow p-0.5 outline-none border-none focus:ring-0"
          />
        </div>
      </div>
      {/* Bộ lọc */}
      <FilterSection onFilterChange={handleFilterChange} />
      {/* Danh sách */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4 text-gray-700">
          Danh sách đặt vé
        </h2>

        <BookingTable
          bookings={filteredBookings}
          onRowClick={handleOpenModal}
        />
      </div>
      {selectedBooking && (
        <BookingDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          booking={selectedBooking}
        />
      )}
    </div>
  );
};
export default BookingManagementPage;
