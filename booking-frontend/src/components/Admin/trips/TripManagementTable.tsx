import { Edit2, Trash2, Calendar, Clock } from "lucide-react";
import type { Trip, TripStatus } from "../../../types/admin/trip";

interface TripManagementTableProps {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
}

const getStatusBadge = (status: TripStatus) => {
  switch (status) {
    case "scheduled":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
          Sắp khởi hành
        </span>
      );
    case "on_going":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
          Đang diễn ra
        </span>
      );
    case "completed":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
          Đã hoàn thành
        </span>
      );
    case "canceled":
      return (
        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
          Đã hủy
        </span>
      );
  }
};

export function TripManagementTable({
  trips,
  onEdit,
  onDelete,
}: TripManagementTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-[#F8FAFC]">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              ID Chuyến
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              Tuyến đường
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              Ngày/Giờ
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              Xe / Biển số
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              Tài xế
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              Giá vé
            </th>
            <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider text-left">
              Hành động
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-100">
          {trips.map((trip) => (
            <tr
              key={trip.id}
              className="hover:bg-gray-50 transition-colors text-sm text-gray-800"
            >
              <td className="px-6 py-4 font-medium text-blue-600">{trip.id}</td>
              <td className="px-6 py-4">{trip.routeName}</td>
              <td className="px-6 py-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  {trip.departureDate}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={14} className="text-gray-400" />
                  {trip.departureTime}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium">{trip.busCompanyName}</div>
                <div className="text-xs text-gray-500">{trip.busPlate}</div>
              </td>
              <td className="px-6 py-4">{trip.driverName}</td>
              <td className="px-6 py-4">{getStatusBadge(trip.status)}</td>
              <td className="px-6 py-4 font-semibold text-emerald-700">
                {trip.price.toLocaleString("vi-VN")} ₫
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(trip)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-xs hover:bg-gray-100 transition cursor-pointer"
                  >
                    <Edit2 size={14} /> Sửa
                  </button>
                  <button
                    onClick={() => onDelete(trip.id)}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-xs hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {trips.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Không tìm thấy chuyến đi nào.
        </div>
      )}
    </div>
  );
}
