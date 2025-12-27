import React, { useState } from "react";
import { Plus, Search } from "lucide-react";

import StatisticCard from "@/components/Admin/fleets/StatisticCard";
import BusCard from "@/components/Admin/fleets/BusCard";
import BusModal from "@/components/Admin/fleets/BusModal";
import SeatConfigModal from "@/components/Admin/fleets/SeatConfigModal";

import type { Bus } from "@/types/bus.type";
import type { Seat } from "@/types/seat.type";
import { mockBuses, mockSeats } from "@/data/seatMock/seat.mock";

const SeatManagementPage: React.FC = () => {
  /* ===================== STATE ===================== */
  const [buses, setBuses] = useState<Bus[]>(mockBuses);
  const [seatMap, setSeatMap] = useState<Record<string, Seat[]>>({
    "bus-001": mockSeats,
  });

  const [search, setSearch] = useState("");
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);

  /* ===================== HANDLERS ===================== */

  const handleAddBus = () => {
    setEditingBus(null);
    setIsBusModalOpen(true);
  };

  const handleEditBus = (bus: Bus) => {
    setEditingBus(bus);
    setIsBusModalOpen(true);
  };

  const handleDeleteBus = (bus: Bus) => {
    setBuses((prev) => prev.filter((b) => b.id !== bus.id));

    setSeatMap((prev) => {
      const { [bus.id]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmitBus = (bus: Bus) => {
    setBuses((prev) => {
      const exists = prev.some((b) => b.id === bus.id);
      return exists
        ? prev.map((b) => (b.id === bus.id ? bus : b))
        : [...prev, bus];
    });
  };

  const handleConfigSeat = (bus: Bus) => {
    setSelectedBus(bus);
    setIsSeatModalOpen(true);
  };

  const handleSaveSeats = (busId: string, updatedSeats: Seat[]) => {
    setSeatMap((prev) => ({
      ...prev,
      [busId]: updatedSeats,
    }));

    setIsSeatModalOpen(false);
    setSelectedBus(null);
  };

  /* ===================== FILTER ===================== */
  const filteredBuses = buses.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.plateNumber.toLowerCase().includes(search.toLowerCase()),
  );

  /* ===================== UI ===================== */
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quản lý đội xe</h1>
        <button
          onClick={handleAddBus}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus size={18} />
          Thêm xe
        </button>
      </div>

      {/* Statistic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticCard title="Tổng số xe" value={buses.length} />
        <StatisticCard
          title="Tổng số ghế"
          value={buses.reduce((sum, b) => sum + b.totalSeats, 0)}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm theo tên xe hoặc biển số..."
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBuses.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            onEdit={handleEditBus}
            onConfigSeat={handleConfigSeat}
            onDelete={handleDeleteBus}
          />
        ))}
      </div>

      {/* Modals */}
      {isBusModalOpen && (
        <BusModal
          bus={editingBus}
          onClose={() => setIsBusModalOpen(false)}
          onSubmit={handleSubmitBus}
        />
      )}

      {isSeatModalOpen && selectedBus && (
        <SeatConfigModal
          bus={selectedBus}
          seats={seatMap[selectedBus.id] ?? []}
          onClose={() => setIsSeatModalOpen(false)}
          onSave={handleSaveSeats}
        />
      )}
    </div>
  );
};

export default SeatManagementPage;
