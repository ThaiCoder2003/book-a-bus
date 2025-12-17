// src/pages/FleetManagementPage.tsx
import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import StatisticCard from "../components/fleets/StatisticCard";
import VehicleCard from "../components/fleets/VehicleCard";
import VehicleModal from "../components/fleets/VehicleModal";
import SeatConfigModal from "../components/fleets/SeatConfigModal";
import type { Vehicle, Seat } from "../types/fleet";
import { mockFleet } from "../data/fleetMock";

const FleetManagementPage: React.FC = () => {
  const [fleet, setFleet] = useState<Vehicle[]>(mockFleet);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isSeatConfigModalOpen, setIsSeatConfigModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [configVehicle, setConfigVehicle] = useState<Vehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Thống kê ---
  const totalVehicles = fleet.length;
  const activeVehicles = fleet.filter((v) => v.status === "Active").length;
  const maintenanceVehicles = fleet.filter(
    (v) => v.status === "Maintenance",
  ).length;
  const totalCapacity = fleet.reduce((sum, v) => sum + v.capacity, 0);

  // --- Tìm kiếm (lọc theo tên hoặc biển số) ---
  const filteredFleet = fleet.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- Modal xe ---
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleSubmitVehicle = (newVehicleData: Vehicle) => {
    if (newVehicleData.id) {
      setFleet((prev) =>
        prev.map((v) => (v.id === newVehicleData.id ? newVehicleData : v)),
      );
    } else {
      const newId = `v${String(fleet.length + 1).padStart(3, "0")}`;
      setFleet((prev) => [...prev, { ...newVehicleData, id: newId }]);
    }
  };

  // --- Modal cấu hình ghế ---
  const handleConfigSeat = (vehicle: Vehicle) => {
    setConfigVehicle(vehicle);
    setIsSeatConfigModalOpen(true);
  };

  const handleSaveSeatConfig = (vehicleId: string, seatLayout: Seat[]) => {
    setFleet((prev) =>
      prev.map((v) => (v.id === vehicleId ? { ...v, seatLayout } : v)),
    );
    alert(
      `Đã lưu cấu hình ghế cho xe ${vehicleId} với ${seatLayout.length} ghế.`,
    );
  };

  // --- Xóa xe ---
  const handleDeleteVehicle = (vehicle: Vehicle) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa xe ${vehicle.name} (${vehicle.licensePlate})?`,
      )
    ) {
      setFleet((prev) => prev.filter((v) => v.id !== vehicle.id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">
            Đội xe & Cấu hình Ghế
          </h1>
          <p className="text-2x1 text-gray-500 mt-1">
            Quản lý đội xe và thiết lập sơ đồ ghế cho từng loại xe
          </p>
        </div>

        <button
          onClick={handleAddVehicle}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} className="mr-2" />
          Thêm xe mới
        </button>
      </div>

      {/* Thanh công cụ */}
      <div className="flex items-center space-x-3 bg-white p-2 border border-gray-300 rounded-lg w-full mb-6">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm xe theo tên, biển số..."
          className="w-full focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Thẻ Thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatisticCard
          title="Tổng số xe"
          value={totalVehicles}
          colorClass="text-blue-600"
        />
        <StatisticCard
          title="Đang hoạt động"
          value={activeVehicles}
          colorClass="text-green-600"
        />
        <StatisticCard
          title="Đang bảo trì"
          value={maintenanceVehicles}
          colorClass="text-red-600"
        />
        <StatisticCard
          title="Tổng số ghế"
          value={totalCapacity}
          colorClass="text-violet-500"
        />
      </div>

      {/* Danh sách xe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredFleet.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            onEdit={handleEditVehicle}
            onConfigSeat={handleConfigSeat}
            onDelete={handleDeleteVehicle}
          />
        ))}
      </div>

      {/* Modals */}
      <VehicleModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSubmit={handleSubmitVehicle}
        editingVehicle={editingVehicle}
      />
      <SeatConfigModal
        key={configVehicle?.id}
        isOpen={isSeatConfigModalOpen}
        onClose={() => setIsSeatConfigModalOpen(false)}
        vehicle={configVehicle}
        onSave={handleSaveSeatConfig}
      />
    </div>
  );
};

export default FleetManagementPage;
