// BookingTable.tsx
import React from "react";
import type { Booking } from "@/types/booking.type";
import BookingTableRow from "./BookingTableRow";
import Pagination from "../ui/Pagination";

interface BookingTableProps {
  bookings: Booking[];
  onRowClick: (booking: Booking) => void; // nhận từ page cha
  paginationData?: {
    total: number;
    page: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  onRowClick,
  paginationData,
  onPageChange
}) => {
  const itemsPerPage = 10;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
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
            {bookings.map((booking) => (
              <BookingTableRow
                key={booking.id}
                booking={booking}
                onActionClick={() => onRowClick(booking)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100">
        <Pagination
          totalItems={paginationData?.total || 0}
          itemsPerPage={itemsPerPage}
          currentPage={paginationData?.page || 1}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default BookingTable;
