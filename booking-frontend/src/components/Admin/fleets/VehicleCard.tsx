import React from "react";
import { Truck, Wifi, Usb, Bed, Car, Settings, Trash2 } from "lucide-react";
import type { Vehicle } from "../../types/fleet";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit?: (vehicle: Vehicle) => void;
  onConfigSeat: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
}

const amenityIcons: Record<string, JSX.Element> = {
  WiFi: <Wifi size={16} />,
  "Cổng USB": <Usb size={16} />,
  "Giường nằm": <Bed size={16} />,
  "Ghế ngồi": <Car size={16} />,
};

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onEdit,
  onConfigSeat,
  onDelete,
}) => {
  const statusActive = vehicle.status === "Active";
  const statusColor = statusActive
    ? "bg-green-100 text-green-700"
    : "bg-orange-100 text-orange-700";
  const statusText = statusActive ? "Hoạt động" : "Bảo trì";

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg w-full max-w-[360px] transition hover:shadow-2xl">
      {/* Banner ảnh */}
      <div className="h-32 relative">
        <img
          src="/modern-plus.png"
          alt="banner"
          className="w-full h-full object-cover"
        />
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold ${statusColor}`}
        >
          {statusText}
        </div>
      </div>

      {/* Nội dung card */}
      <div className="p-4 bg-white">
        <h3 className="text-xl font-semibold text-gray-800">{vehicle.name}</h3>
        <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>

        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p className="flex items-center">
            <Truck size={14} className="mr-2 text-blue-500" />
            Loại xe: <span className="font-medium ml-1">{vehicle.type}</span>
          </p>
          <p className="flex items-center">
            <Car size={14} className="mr-2 text-blue-500" />
            Số ghế:{" "}
            <span className="font-medium ml-1">{vehicle.capacity} ghế</span>
          </p>
        </div>

        {/* Amenities */}
        {vehicle.amenities && vehicle.amenities.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {vehicle.amenities.map((amenity) => (
              <span key={amenity} className="text-gray-500" title={amenity}>
                {amenityIcons[amenity] || <Settings size={16} />}
              </span>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div className="mt-6 flex justify-between items-center space-x-2">
          <button
            onClick={() => onConfigSeat(vehicle)}
            className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Cấu hình ghế
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(vehicle)}
              className="p-2 text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              title="Chỉnh sửa xe"
            >
              <Settings size={20} />
            </button>
          )}
          <button
            onClick={() => onDelete(vehicle)}
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

export default VehicleCard;
