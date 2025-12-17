// src/components/SeatConfigModal.tsx
import React, { useState, useMemo } from "react";
import type { Vehicle, Seat, SeatType } from "../../types/fleet";
import { X, Check } from "lucide-react";

interface SeatConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  onSave: (vehicleId: string, seatLayout: Seat[]) => void;
}

const seatTypes: {
  type: SeatType;
  label: string;
  color: string;
  price?: number;
}[] = [
  {
    type: "Standard",
    label: "Ghế thường",
    color: "bg-blue-500",
    price: 200000,
  },
  { type: "VIP", label: "Ghế VIP", color: "bg-purple-500", price: 300000 },
  {
    type: "Luxury",
    label: "Giường nằm",
    color: "bg-yellow-500",
    price: 350000,
  },
  { type: "Empty", label: "Trống", color: "bg-gray-200" },
];

const createInitialSeatLayout = (capacity: number): Seat[] => {
  const layout: Seat[] = [];
  for (let i = 1; i <= capacity; i++) {
    layout.push({
      id: `H${Math.ceil(i / 4)}-${((i - 1) % 4) + 1}`,
      type: "Standard",
      price: 200000,
    });
  }
  return layout;
};

const SeatConfigModal: React.FC<SeatConfigModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  onSave,
}) => {
  // ✅ Khởi tạo layout ban đầu dựa trên vehicle, không cần effect
  const [currentLayout, setCurrentLayout] = useState<Seat[]>(() => {
    if (!vehicle) return [];
    return vehicle.seatLayout && vehicle.seatLayout.length > 0
      ? vehicle.seatLayout
      : createInitialSeatLayout(vehicle.capacity);
  });

  const [currentSeatType, setCurrentSeatType] = useState<SeatType>("Standard");

  // ✅ Khi vehicle thay đổi (VD: chọn xe khác), React sẽ tạo lại component với key khác
  // nên ta reset layout bằng cách thêm key={vehicle?.id} khi render component cha

  const getSeatColor = (type: SeatType) =>
    seatTypes.find((s) => s.type === type)?.color || "bg-gray-400";
  const getSeatPrice = (type: SeatType) =>
    seatTypes.find((s) => s.type === type)?.price;

  const handleSeatClick = (seatId: string) => {
    setCurrentLayout((prev) =>
      prev.map((seat) =>
        seat.id === seatId
          ? {
              ...seat,
              type: currentSeatType,
              price: getSeatPrice(currentSeatType),
            }
          : seat,
      ),
    );
  };

  const handleSave = () => {
    if (vehicle) onSave(vehicle.id, currentLayout);
    onClose();
  };

  const groupedSeats = useMemo(() => {
    return currentLayout.reduce((acc, seat) => {
      const [row, col] = seat.id.split("-");
      if (!acc[row]) acc[row] = [];
      acc[row][parseInt(col) - 1] = seat;
      return acc;
    }, {} as { [key: string]: Seat[] });
  }, [currentLayout]);

  const rows = useMemo(
    () =>
      Object.entries(groupedSeats).sort(
        ([a], [b]) =>
          parseInt(a.replace("H", "")) - parseInt(b.replace("H", "")),
      ),
    [groupedSeats],
  );

  if (!isOpen || !vehicle) return null;

  const SeatComponent: React.FC<{ seat: Seat }> = ({ seat }) => {
    const color = getSeatColor(seat.type);
    const seatNumber = seat.id.split("-")[0];
    return (
      <div
        onClick={() => handleSeatClick(seat.id)}
        className={`w-10 h-10 p-1 rounded-md shadow-sm cursor-pointer transition flex items-center justify-center text-sm font-medium
          ${color} ${
          color === "bg-gray-200" ? "text-gray-800" : "text-white"
        } hover:opacity-80`}
        title={`Ghế: ${seat.id} - Loại: ${
          seatTypes.find((t) => t.type === seat.type)?.label
        }`}
      >
        {seatNumber}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Cấu hình sơ đồ ghế - {vehicle.name} - {vehicle.licensePlate}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/4 p-6 border-r flex flex-col space-y-4">
            <h3 className="text-lg font-semibold mb-2">Loại ghế</h3>
            {seatTypes.map((s) => (
              <div
                key={s.type}
                onClick={() => setCurrentSeatType(s.type)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  currentSeatType === s.type
                    ? "bg-blue-100 ring-2 ring-blue-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${s.color}`}
                    ></span>
                    <span className="font-medium text-gray-700">{s.label}</span>
                  </div>
                  {s.price && (
                    <span className="text-sm text-gray-500">
                      {s.price.toLocaleString("vi-VN")} VND
                    </span>
                  )}
                  {currentSeatType === s.type && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-6 overflow-y-auto">
            <p className="text-sm text-gray-500 mb-4">
              Click vào ghế để thay đổi loại ghế. Loại ghế đang chọn:{" "}
              <span
                className={`font-semibold ${getSeatColor(
                  currentSeatType,
                ).replace("bg-", "text-")}`}
              >
                {seatTypes.find((s) => s.type === currentSeatType)?.label}
              </span>
            </p>

            <div className="space-y-4">
              {rows.map(([rowName, seats]) => (
                <div key={rowName} className="flex items-center space-x-4">
                  <span className="w-8 font-medium text-gray-600">
                    {rowName}
                  </span>
                  <div className="flex space-x-3">
                    <div className="flex space-x-2">
                      {seats[0] && <SeatComponent seat={seats[0]} />}
                      {seats[1] && <SeatComponent seat={seats[1]} />}
                    </div>
                    <div className="w-10"></div>
                    <div className="flex space-x-2">
                      {seats[2] && <SeatComponent seat={seats[2]} />}
                      {seats[3] && <SeatComponent seat={seats[3]} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatConfigModal;
