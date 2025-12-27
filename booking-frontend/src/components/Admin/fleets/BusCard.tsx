import React from "react";
import { Truck, Car, Settings, Trash2 } from "lucide-react";
import type { Bus } from "@/types/bus.type";

interface BusCardProps {
  bus: Bus;
  onEdit?: (bus: Bus) => void;
  onConfigSeat: (bus: Bus) => void;
  onDelete: (bus: Bus) => void;
}

const BusCard: React.FC<BusCardProps> = ({
  bus,
  onEdit,
  onConfigSeat,
  onDelete,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-[360px] transition hover:shadow-2xl">
      {/* Banner */}
      <div className="h-32 relative">
        <img
          src="/modern-plus.png"
          alt="bus"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 bg-white">
        <h3 className="text-xl font-semibold text-gray-800">{bus.name}</h3>
        <p className="text-sm text-gray-500">{bus.plateNumber}</p>

        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p className="flex items-center">
            <Truck size={14} className="mr-2 text-blue-500" />
            ID xe:{" "}
            <span className="font-medium ml-1">{bus.id.slice(0, 8)}</span>
          </p>

          <p className="flex items-center">
            <Car size={14} className="mr-2 text-blue-500" />
            Số ghế:
            <span className="font-medium ml-1">{bus.totalSeats} ghế</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between items-center space-x-2">
          <button
            onClick={() => onConfigSeat(bus)}
            className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Cấu hình ghế
          </button>

          {onEdit && (
            <button
              onClick={() => onEdit(bus)}
              className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              title="Chỉnh sửa xe"
            >
              <Settings size={20} />
            </button>
          )}

          <button
            onClick={() => onDelete(bus)}
            className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
            title="Xóa xe"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
