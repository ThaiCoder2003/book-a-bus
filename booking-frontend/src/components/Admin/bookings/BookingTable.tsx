// BookingTable.tsx
import React, { useState } from "react";
import type { Booking } from "@/types/booking.type";
import BookingTableRow from "./BookingTableRow";
import Pagination from "../ui/Pagination";
interface BookingTableProps {
  bookings: Booking[];
  onRowClick: (booking: Booking) => void; // nhận từ page cha
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onRowClick,
}) => {
  // 1. Khai báo các biến quản lý phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Bạn có thể thay đổi số lượng mục mỗi trang ở đây

  // 2. Tính toán dữ liệu sẽ hiển thị trên trang hiện tại
  const totalItems = bookings.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = bookings.slice(startIndex, endIndex);
  return (
    <>
      <div className="overflow-x-auto relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="whitespace-nowrap">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã vé
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tuyến đường
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày xuất hành
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số vé
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((booking) => (
              <BookingTableRow
                key={booking.id}
                booking={booking}
                onActionClick={() => onRowClick(booking)} // gọi prop từ cha
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* 4. Truyền đúng các props cho Pagination */}
      <div className="px-6 py-4 border-t border-gray-100">
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page);
            // Optional: Cuộn lên đầu bảng khi đổi trang
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    </>
  );
};

export default BookingTable;
