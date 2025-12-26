"use client";

import { useState } from "react";

import RouteSearchBar from "@/components/Admin/routesManagement/RouteSearchBar";
import CreateRouteButton from "@/components/Admin/routesManagement/CreateRouteButton";
import RouteTable from "@/components/Admin/routesManagement/RouteTable";
import StopsModal from "@/components/Admin/routesManagement/StopsModal";
import CreateRouteModal from "@/components/Admin/routesManagement/CreateRouteModal";

import type { Route } from "@/types/route.type";
import { ROUTES_MOCK } from "@/data/routeMock/index.ts";

export default function RoutesPage(): JSX.Element {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isCreateRouteOpen, setIsCreateRouteOpen] = useState(false);

  const handleViewDetails = (routeId: string) => {
    const route = ROUTES_MOCK.find((r) => r.id === routeId) ?? null;
    setSelectedRoute(route);
  };

  const handleCloseModal = () => setSelectedRoute(null);

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
        <RouteSearchBar />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        {/* RouteTable chỉ cần list route, khi click gọi onViewDetails(id) */}
        <RouteTable routes={ROUTES_MOCK} onViewDetails={handleViewDetails} />
      </div>

      {/* Popup xem chi tiết tuyến */}
      {selectedRoute && (
        <StopsModal route={selectedRoute} onClose={handleCloseModal} />
      )}

      {/* Popup tạo tuyến đường */}
      <CreateRouteModal
        isOpen={isCreateRouteOpen}
        onClose={() => setIsCreateRouteOpen(false)}
      />
    </div>
  );
}
