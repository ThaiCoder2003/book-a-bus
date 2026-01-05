"use client";

import { useEffect, useState, type JSX } from "react";

import routeService from "@/services/routeService";
import stationService from "@/services/stationService";

import RouteSearchBar from "@/components/Admin/routesManagement/RouteSearchBar";
import CreateRouteButton from "@/components/Admin/routesManagement/CreateRouteButton";
import RouteTable from "@/components/Admin/routesManagement/RouteTable";
import StopsModal from "@/components/Admin/routesManagement/StopsModal";
import CreateRouteModal from "@/components/Admin/routesManagement/CreateRouteModal";
import Pagination from "@/components/Admin/ui/Pagination";

import type { Route } from "@/types/route.type";
import type { Station } from "@/types/station.type";
import { toast } from "react-toastify";

export default function RoutesPage(): JSX.Element {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isCreateRouteOpen, setIsCreateRouteOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(""); 

  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState<Station[]>([]);

  const [routes, setRoutes] = useState<Route[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const fetchStations = async () => {
    try {
      const result = await stationService.getStations();
      setStations(result.stations);
    } catch (error) {
      console.error("Failed to fetch stations", error);
    }
  };

  const fetchRoutes = async () => {
    try {
      // Nếu có search term thì gọi search, không thì getAll
      const getRoutes = await routeService.getRoutes(searchTerm, currentPage)

      setRoutes(getRoutes.routes);
      setTotalItems(getRoutes.pagination.total)
    } catch (error) {
      console.error("Failed to fetch routes", error);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
      setCurrentPage(1); // Reset về trang 1 mỗi khi search cái mới
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchRoutes();
  }, [currentPage, searchTerm]);

  const handleSearch = (val: string) => {
    setSearchInput(val);
    setCurrentPage(1); 
  };

const handleViewDetails = async (routeId: string) => {
  setIsModalLoading(true); // Bắt đầu loading
  try {
    // 2. Gọi API lấy chi tiết thay vì tìm trong mảng routes
    const fullRouteData = await routeService.getById(routeId);
    setSelectedRoute(fullRouteData);
  } catch (error) {
    toast.error("Không thể tải thông tin chi tiết tuyến đường");
  } finally {
    setIsModalLoading(false); // Tắt loading
  }
};

  const handleCloseModal = () => setSelectedRoute(null);

  const itemsPerPage = 10;
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý Tuyến đường & Điểm dừng
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Quản lý toàn bộ tuyến đường và điểm đón / trả khách của hệ thống.
          </p>
        </div>

        <CreateRouteButton onOpen={() => setIsCreateRouteOpen(true)} />
      </div>

      <div className="mb-6 w-full">
        <RouteSearchBar onSearch={handleSearch}/>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* RouteTable chỉ cần list route, khi click gọi onViewDetails(id) */}
        <RouteTable routes={routes} onViewDetails={handleViewDetails} totalItems={totalItems} onDeleteSuccess={fetchRoutes} />
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Popup xem chi tiết tuyến */}
      {selectedRoute && (
        <StopsModal route={selectedRoute} onClose={handleCloseModal} isLoading={isModalLoading} />
      )}

      {/* Popup tạo tuyến đường */}
      <CreateRouteModal
        stations={stations}
        isOpen={isCreateRouteOpen}
        onClose={() => setIsCreateRouteOpen(false)}
        onSuccess={fetchRoutes}
      />
    </div>
  );
}
