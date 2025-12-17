import React from "react";
import type { Booking } from "../../types/booking";
import { Info } from "lucide-react";

interface BookingTableRowProps {
  booking: Booking;
  onActionClick: () => void;
}

// Hàm helper xác định màu nhãn theo trạng thái
const getStatusBadgeClass = (
  status: Booking["status"] | Booking["paymentStatus"],
) => {
  switch (status) {
    case "Đã xác nhận":
    case "Đã thanh toán":
      return "bg-green-100 text-green-800";
    case "Đang chờ":
    case "Chưa thanh toán":
      return "bg-yellow-100 text-yellow-800";
    case "Đã hủy":
    case "Đã hoàn tiền":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const BookingTableRow: React.FC<BookingTableRowProps> = ({
  booking,
  onActionClick,
}) => {
  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      {/* Mã đặt vé */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        {booking.id}
      </td>

      {/* Tên khách hàng */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {booking.customer}
      </td>

      {/* Tuyến */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {booking.route}
      </td>

      {/* Ngày khởi hành */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {booking.departureDate}
      </td>

      {/* Tổng tiền */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        {booking.totalPrice}
      </td>

      {/* Trạng thái */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
            booking.status,
          )}`}
        >
          {booking.status}
        </span>
      </td>

      {/* Thanh toán */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
            booking.paymentStatus,
          )}`}
        >
          {booking.paymentStatus}
        </span>
      </td>

      {/* Hành động */}
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <button
          onClick={onActionClick}
          className="text-gray-500 hover:text-gray-700 p-1"
          title="Xem chi tiết"
        >
          <Info className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

export default BookingTableRow;
