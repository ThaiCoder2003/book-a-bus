import React, { useMemo, useState } from "react";
import { X, Check } from "lucide-react";

import type { Bus } from "@/types/bus.type";
import type { Seat } from "@/types/seat.type";
import type { SeatType } from "@/types/enum";
import { SEAT_TYPE_META } from "@/data/seatMock/seatTypeMeta";

interface Props {
  bus: Bus | null;
  seats: Seat[];
  onClose: () => void;
  onSave: (busId: string, seats: Seat[]) => void;
}

const SeatConfigModal: React.FC<Props> = (props) => {
  const { bus, seats, onClose, onSave } = props;

  const [currentSeats, setCurrentSeats] = useState<Seat[]>(seats);
  const [currentType, setCurrentType] = useState<SeatType>("SEAT");

  const groupedByRow = useMemo(() => {
    return currentSeats.reduce<Record<number, Seat[]>>((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row][seat.col] = seat;
      return acc;
    }, {});
  }, [currentSeats]);

  const handleSave = () => {
    if (!bus) return;

    const normalizedSeats = currentSeats.map((s) => ({
      ...s,
      busId: bus.id,
    }));

    onSave(bus.id, normalizedSeats);
  };

  const handleSeatClick = (seatId: string) => {
    setCurrentSeats((prev) =>
      prev.map((s) => (s.id === seatId ? { ...s, type: currentType } : s)),
    );
  };
  // ✅ CHECK bus SAU KHI GỌI HẾT HOOK
  if (!bus) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">Loading...</div>
      </div>
    );
  }
  const rows = Object.keys(groupedByRow)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Cấu hình ghế – {bus.name} ({bus.plateNumber})
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Seat type selector */}
          <div className="w-64 p-4 border-r space-y-3">
            {(Object.keys(SEAT_TYPE_META) as SeatType[]).map((type) => (
              <div
                key={type}
                onClick={() => setCurrentType(type)}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center
                  ${
                    currentType === type
                      ? "bg-blue-100 ring-2 ring-blue-500"
                      : "hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center">
                  <span
                    className={`w-3 h-3 mr-2 rounded-full ${SEAT_TYPE_META[type].color}`}
                  />
                  {SEAT_TYPE_META[type].label}
                </div>
                {currentType === type && <Check size={16} />}
              </div>
            ))}
          </div>

          {/* Seat layout */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {rows.map((row) => (
              <div key={row} className="flex items-center gap-4">
                <span className="w-6 text-sm font-medium">R{row}</span>

                <div className="flex gap-3">
                  {groupedByRow[row].map(
                    (seat) =>
                      seat && (
                        <div
                          key={seat.id}
                          onClick={() => handleSeatClick(seat.id)}
                          title={`${seat.label} – ${
                            SEAT_TYPE_META[seat.type].label
                          }`}
                          className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-semibold text-white cursor-pointer
                            ${SEAT_TYPE_META[seat.type].color}`}
                        >
                          {seat.label}
                        </div>
                      ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatConfigModal;
