// pages/Admin/TripManagementPage.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import type { Trip } from "@/types/trip.type";
import { TripManagementTable } from "@/components/Admin/trips/TripManagementTable";
import { TripFormModal } from "@/components/Admin/trips/TripFormModal";

// pages/Admin/TripManagementPage.tsx
import { mockTrips } from "@/data/tripMock/tripMock";
import { mockBuses } from "@/data/tripMock/busMock";
import { mockRoutes } from "@/data/tripMock/routeMock";

export function TripManagementPage() {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const filteredTrips = trips.filter((trip) => {
    const search = searchTerm.trim().toLowerCase();
    const route = mockRoutes.find((r) => r.id === trip.routeId);
    const bus = mockBuses.find((b) => b.id === trip.busId);

    return (
      !search ||
      [trip.id, route?.name, bus?.name, bus?.plateNumber].some((f) =>
        (f ?? "").toLowerCase().includes(search),
      )
    );
  });

  const handleOpenCreateModal = () => {
    setSelectedTrip(null);
    setShowModal(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const handleDeleteTrip = (tripId: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chuyến đi ${tripId}?`)) {
      setTrips(trips.filter((t) => t.id !== tripId));
    }
  };

  const handleSubmitTrip = (tripData: Trip) => {
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">
            Quản lý chuyến đi
          </h1>
          <input
            type="text"
            placeholder="Tìm kiếm chuyến đi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2 px-3 py-2 border rounded w-full max-w-sm"
          />
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 shadow-sm"
        >
          <Plus size={18} />
          <span className="font-medium">Thêm chuyến đi</span>
        </button>
      </div>

      <TripManagementTable
        trips={filteredTrips.map((t) => ({
          ...t,
          route: mockRoutes.find((r) => r.id === t.routeId),
          bus: mockBuses.find((b) => b.id === t.busId),
        }))}
        onEdit={handleEditTrip}
        onDelete={handleDeleteTrip}
      />

      <TripFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        tripToEdit={selectedTrip}
        onSubmit={handleSubmitTrip}
        routes={mockRoutes}
        buses={mockBuses}
      />
    </div>
  );
}
