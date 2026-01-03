// pages/Admin/TripManagementPage.tsx
"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";

import type { Trip } from "@/types/trip.type";
import { TripManagementTable } from "@/components/Admin/trips/TripManagementTable";
import { TripFormModal } from "@/components/Admin/trips/TripFormModal";

import tripService from "@/services/tripService";
import busService from "@/services/busService"

// pages/Admin/TripManagementPage.tsx

import { toast } from "react-toastify";
import type { Bus } from "@/types/bus.type";
import type { Route } from "@/types/route.type";
import routeService from "@/services/routeService";

export function TripManagementPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [buses, setBuses] = useState<Bus[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [searchInput, setSearchInput] = useState("")
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const loadBuses = async () => {
    try {
      const response = await busService.getBuses()

      setBuses(response.buses)
    } catch (error) {
      console.error("Lỗi tải chuyến đi:", error);
    }
  }

  const loadRoutes = async () => {
    try {
      const response = await routeService.getRoutes('', 1, 1000)

      setRoutes(response.routes)
    } catch (error) {
      console.error("Lỗi tải chuyến đi:", error);
    }
  }

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await tripService.getAllNoFilter(query);
      // Lưu ý: Nếu Backend trả về dạng { data: [...], pagination: ... } 
      // thì bạn setTrips(response.data)
      setTrips(response); 
    } catch (error) {
      console.error("Lỗi tải chuyến đi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses()
  }, []);

  useEffect(() => {
    loadRoutes()
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery(searchInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    loadData();
  }, [query]);

  const handleOpenCreateModal = () => {
    setSelectedTrip(null);
    setShowModal(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      if (window.confirm(`Bạn có chắc chắn muốn xóa chuyến đi ${tripId}?`)) {
        await tripService.deleteTrip(tripId)
        toast.success('Xóa thành công!')
        setTrips(trips.filter((t) => t.id !== tripId));
      }
    }
// TripManagementPage.tsx
catch (error: any) {
    console.log("--- FRONTEND CATCH ---");
    console.log("Status:", error.response?.status);
    console.log("Data:", error.response?.data); // Đây là nơi chứa tin nhắn lỗi thật
    console.error("Full Error:", error);
    toast.error(error.response?.data?.message || "Lỗi xóa chuyến đi");
}
  };

  const handleSubmitTrip = async (data: any) => {
      try {
        if (selectedTrip) {
          await tripService.updateTrip(selectedTrip.id, data)
          toast.success("Update chuyến đi thành công!");
        }

        else {
          await tripService.registerNewTrip(data);
          toast.success("Tạo chuyến đi thành công!");
        }

        loadData(); // Refresh lại table
        setShowModal(false);
      } catch (error) {
          toast.error("Lỗi: " + error);
      }
  }

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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

      {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-dashed border-gray-300 shadow-sm">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
            <p className="text-gray-500 font-medium">Đang lấy dữ liệu chuyến đi...</p>
          </div>
        ) : trips.length > 0 ? (
          <TripManagementTable
            trips={trips}
            onEdit={handleEditTrip}
            onDelete={handleDeleteTrip}
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border text-gray-500">
            Không tìm thấy chuyến đi nào khớp với từ khóa "{query}"
          </div>
      )}

      <TripFormModal
        open={showModal}
        onClose={() => setShowModal(false)}
        tripToEdit={selectedTrip}
        onSubmit={handleSubmitTrip}
        routes={routes}
        buses={buses}
      />
    </div>
  );
}
