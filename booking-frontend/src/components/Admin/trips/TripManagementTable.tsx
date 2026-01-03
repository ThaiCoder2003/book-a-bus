import { Edit2, Trash2, Calendar, Clock } from "lucide-react";
import type { Trip } from "@/types/trip.type";

export function TripManagementTable({
  trips,
  onEdit,
  onDelete,
}: {
  trips: Trip[];
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {[
              "ID Chuyến",
              "Tuyến đường",
              "Ngày/Giờ",
              "Xe / Biển số",
              "Hành động",
            ].map((head) => (
              <th
                key={head}
                className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {trips.map((trip) => (
            <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-blue-600">{trip.id.slice(0, 8)}</td>
              <td className="px-6 py-4 text-slate-700 font-medium">
                {trip.route?.name}
              </td>
              <td className="px-6 py-4 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-slate-400" />{" "}
                  {new Date(trip.departureTime).toLocaleDateString("vi-VN")}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={14} className="text-slate-400" />{" "}
                  {new Date(trip.departureTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-800">
                  {trip.bus?.name}
                </div>
                <div className="text-xs text-slate-400">
                  {trip.bus?.plateNumber}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(trip)}
                    className="flex items-center gap-1 px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-600"
                  >
                    <Edit2 size={14} /> <span className="text-xs">Sửa</span>
                  </button>
                  <button
                    onClick={() => onDelete(trip.id)}
                    className="flex items-center gap-1 px-2 py-1 border border-red-100 rounded hover:bg-red-50 text-red-500"
                  >
                    <Trash2 size={14} /> <span className="text-xs">Xóa</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
