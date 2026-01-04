// BookingManagementPage.tsx
import { useState, useEffect } from "react";
import BookingTable from "../../components/Admin/bookings/BookingTable";
import FilterSection from "../../components/Admin/bookings/FilterSection";
import type { Filters } from "../../components/Admin/bookings/FilterSection";
import BookingDetailModal from "../../components/Admin/bookings/BookingDetailModal";
import { Search, FileSpreadsheet, Loader2 } from "lucide-react";
import type { Booking } from "../../types/booking.type";


import bookingService from "@/services/bookingService";

interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

const BookingManagementPage: React.FC = () => {
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([])
  const [totalBooking, setTotalBooking] = useState(0); // Để hiện tổng số đơn
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({});
  const [searchInput, setSearchInput] = useState("")
  const [query, setQuery] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 10,
          query: query || undefined, // Gửi search từ debounce
          ...filters, // Gửi status, route, startDate, endDate
        };
        const data = await bookingService.getAll(params);

        setTotalBooking(data.totalBooking)
        setBookings(data.bookings);
        setPagination(data.pagination);
      } catch(error) {
        console.error("Lỗi fetch bookings:", error);
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchBookings()
  }, [query, filters, currentPage])
  // Lọc bookings dựa trên Filters
  const handleFilterChange = (filters: Filters) => {
    setFilters(filters),
    setCurrentPage(1)
  };

  const handleOpenModal = async (booking: Booking) => {
    setIsModalOpen(true); // Mở modal ngay để hiện loading (nếu modal có trạng thái loading)
    setLoading(true); // Hoặc dùng một state loading riêng cho Modal
    
    try {
      // Gọi API lấy chi tiết (đã bao gồm ticketCount, tickets[], user...)
      const detailedBooking = await bookingService.getByIdForAdmin(booking.id);
      
      if (detailedBooking) {
        setSelectedBooking(detailedBooking);
      } else {
        setSelectedBooking(booking); // Fallback nếu lỗi
      }
    } catch (error) {
      console.error("Không thể lấy chi tiết booking:", error);
      setSelectedBooking(booking);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  const handleUpdateBooking = (updatedBooking: Booking) => {
      // 1. Cập nhật dữ liệu cho Modal đang mở
      setSelectedBooking(updatedBooking);

      // 2. Cập nhật dòng tương ứng trong Table
      setBookings((prev) =>
        prev.map((b) => (b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b))
      );
      
      // 3. (Tùy chọn) Thông báo thành công
      // toast.success("Cập nhật trạng thái thành công!");
    };
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">
            Quản lý đặt chỗ
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tổng cộng:{" "}
            <span className="font-bold text-blue-600">
              {totalBooking}
            </span>{" "}
            đơn đặt vé
          </p>
        </div>
        <button className="px-4 py-2 text-sm text-black bg-white rounded flex items-center border border-gray-300 hover:bg-blue-900 hover:text-white transition duration-150 cursor-pointer">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Xuất Excel
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-800">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo ID đơn, tên khách hoặc SĐT..."
            className="grow p-0.5 outline-none border-none focus:ring-0 text-sm"
          />
        </div>
      </div>

      {/* Filter */}
      <FilterSection onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-dashed border-gray-300 shadow-sm">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-500 font-medium">Đang lấy dữ liệu booking...</p>
          </div>
        ) : bookings.length > 0 ? (
          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4 text-gray-700">
              Danh sách đặt vé hiện tại
            </h2>
            <BookingTable
              bookings={bookings}
              onRowClick={handleOpenModal}
              paginationData={pagination || undefined}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>

        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border text-gray-500">
            Không tìm thấy chuyến đi nào khớp với từ khóa "{query}"
          </div>
      )}

      {/* Detail modal */}
      {selectedBooking && (
        <BookingDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          booking={selectedBooking}
          onUpdateBooking={handleUpdateBooking}
        />
      )}
    </div>
  );
};

export default BookingManagementPage;
