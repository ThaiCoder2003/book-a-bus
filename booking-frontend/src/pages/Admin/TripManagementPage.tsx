"use client";

import { useState } from "react";
import type { Trip, TripFilter } from "../../types/admin/trip";
import { mockTrips } from "../../data/tripMock";
import { TripFilterPanel } from "../../components/Admin/trips/TripFilterPanel";
import { TripManagementTable } from "../../components/Admin/trips/TripManagementTable";
import { TripFormModal } from "../../components/Admin/trips/TripFormModal";
import { Plus } from "lucide-react";

export function TripManagementPage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [filter, setFilter] = useState<TripFilter>({
    searchTerm: "",
    status: "all",
    routeId: "all",
    busCompanyId: "all",
    minPrice: undefined,
    maxPrice: undefined,
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null); // Trip đang edit/view

  // Logic Lọc/Tìm kiếm
  //  Logic Lọc/Tìm kiếm mở rộng
  const filteredTrips = trips.filter((trip) => {
    const search = filter.searchTerm.trim().toLowerCase();

    // Tìm kiếm đa trường
    const matchesSearch =
      !search ||
      [
        trip.id,
        trip.routeName,
        trip.departurePoint,
        trip.arrivalPoint,
        trip.busCompanyName,
        trip.busPlate,
        trip.driverName,
      ].some((field) => (field ?? "").toLowerCase().includes(search));

    // Trạng thái
    const matchesStatus =
      filter.status === "all" || trip.status === filter.status;

    // Tuyến đường
    const matchesRoute =
      filter.routeId === "all" || trip.routeId === filter.routeId;

    // Nhà xe
    const matchesBusCompany =
      filter.busCompanyId === "all" ||
      trip.busCompanyName
        ?.toLowerCase()
        .includes(filter.busCompanyId.toLowerCase());

    // Ngày khởi hành (lọc chính xác)
    const matchesDate =
      !filter.departureDate || trip.departureDate === filter.departureDate;

    // Khoảng giá
    const matchesPrice =
      (filter.minPrice === undefined || trip.price >= filter.minPrice) &&
      (filter.maxPrice === undefined || trip.price <= filter.maxPrice);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesRoute &&
      matchesBusCompany &&
      matchesDate &&
      matchesPrice
    );
  });

  // === Handlers (Điều phối) ===
  const handleOpenCreateModal = () => {
    setSelectedTrip(null); // Đặt null để modal biết là chế độ tạo mới
    setShowModal(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chuyến đi ${tripId}?`)) {
      // Logic gọi API DELETE
      setTrips(trips.filter((t) => t.id !== tripId)); // Cập nhật UI
      console.log(`Xóa chuyến đi: ${tripId}`);
    }
  };

  const handleSubmitTrip = (tripData: Trip) => {
    // Logic gọi API Save/Update ở đây

    // Cập nhật state
    if (selectedTrip) {
      setTrips(trips.map((t) => (t.id === selectedTrip.id ? tripData : t)));
    } else {
      setTrips([...trips, tripData]);
    }

    setShowModal(false);
    setSelectedTrip(null);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">
            Quản lý chuyến đi
          </h1>
          <p className="text-2x1 text-gray-500 mt-1">
            Theo dõi, tạo mới và cập nhật lịch trình các chuyến xe
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          <Plus size={18} />
          <span className="font-medium">Thêm chuyến đi</span>
        </button>
      </div>

      <TripFilterPanel filter={filter} setFilter={setFilter} />

      <div className="mt-8">
        <TripManagementTable
          trips={filteredTrips}
          onEdit={handleEditTrip}
          onDelete={handleDeleteTrip}
        />
      </div>

      <TripFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        tripToEdit={selectedTrip}
        onSubmit={handleSubmitTrip}
      />
    </div>
  );
}
