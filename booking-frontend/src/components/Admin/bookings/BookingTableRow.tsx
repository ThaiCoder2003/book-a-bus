// BookingTableRow.tsx
import React from "react";
import type { Booking } from "@/types/booking.type";
import { Info } from "lucide-react";

import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface BookingTableRowProps {
  booking: Booking;
  onActionClick: () => void;
}

const getStatusBadgeClass = (status: Booking["status"]) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const BookingTableRow: React.FC<BookingTableRowProps> = ({
  booking,
  onActionClick,
}) => {
  const displayDate = (dateString: string) => {
    const date = new Date(dateString);
    // Format thành: 08:00, 01/01/2026
    return format(date, "HH:mm, dd/MM/yyyy", { locale: vi });
  };
  return (
    <tr className="hover:bg-gray-50 transition duration-150">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        {booking.id.slice(0, 8)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {booking.user?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {booking.trip?.route?.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {displayDate(booking?.trip?.departureTime || new Date().toISOString())}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        {booking.totalAmount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
            booking.status,
          )}`}
        >
          {booking.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
        {booking.ticketCount}
      </td>
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
