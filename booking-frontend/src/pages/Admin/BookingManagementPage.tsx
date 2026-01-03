// BookingManagementPage.tsx
import { useState, useMemo } from "react";
import BookingTable from "../../components/Admin/bookings/BookingTable";
import FilterSection from "../../components/Admin/bookings/FilterSection";
import type { Filters } from "../../components/Admin/bookings/FilterSection";
import BookingDetailModal from "../../components/Admin/bookings/BookingDetailModal";
import { Search, FileSpreadsheet } from "lucide-react";
import { mockBookings } from "../../data/booking.mock";
import type { Booking } from "../../types/booking.type";

const BookingManagementPage: React.FC = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredBookings, setFilteredBookings] =
    useState<Booking[]>(mockBookings);
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc bookings dựa trên Filters
  const handleFilterChange = (filters: Filters) => {
    let result = [...mockBookings];

    if (filters.status) {
      result = result.filter((b) => b.status === filters.status);
    }

    if (filters.route) {
      result = result.filter((b) => b.trip?.route?.name === filters.route);
    }

    if (filters.startDate) {
      const start = new Date(filters.startDate);
      result = result.filter(
        (b) => b.trip?.departureTime && new Date(b.trip.departureTime) >= start,
      );
    }

    if (filters.endDate) {
      const end = new Date(filters.endDate);
      result = result.filter(
        (b) => b.trip?.departureTime && new Date(b.trip.departureTime) <= end,
      );
    }

    setFilteredBookings(result);
  };

  // Search kết hợp với lọc
  const displayedBookings = useMemo(() => {
    if (!searchTerm) return filteredBookings;
    const lowerSearch = searchTerm.toLowerCase();
    return filteredBookings.filter(
      (b) =>
        b.id.toLowerCase().includes(lowerSearch) ||
        b.user?.name.toLowerCase().includes(lowerSearch) ||
        b.user?.phone.includes(lowerSearch),
    );
  }, [searchTerm, filteredBookings]);

  const handleOpenModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };
  const handleUpdateBooking = (updatedBooking: Booking) => {
    // 1. Update booking đang được chọn
    setSelectedBooking(updatedBooking);

    // 2. Update list bookings (để table đổi theo)
    setFilteredBookings((prev) =>
      prev.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)),
    );
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
              {filteredBookings.length}
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo ID đơn, tên khách hoặc SĐT..."
            className="grow p-0.5 outline-none border-none focus:ring-0 text-sm"
          />
        </div>
      </div>

      {/* Filter */}
      <FilterSection onFilterChange={handleFilterChange} />

      {/* Booking table */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4 text-gray-700">
          Danh sách đặt vé hiện tại
        </h2>
        <BookingTable
          bookings={displayedBookings}
          onRowClick={handleOpenModal}
        />
      </div>

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
