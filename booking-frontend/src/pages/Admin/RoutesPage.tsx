"use client";

import { useState } from "react";
import RouteSearchBar from "../../components/Admin/routesManagement/RouteSearchBar";
import CreateRouteButton from "../../components/Admin/routesManagement/CreateRouteButton";
import RouteTable from "../../components/Admin/routesManagement/RouteTable";
import StopsModal from "../../components/Admin/routesManagement/StopsModal";
import CreateRouteModal from "../../components/Admin/routesManagement/CreateRouteModal";

import type { Stop } from "../../types/admin/stop";

interface RouteDetails {
  id: string | number;
  name: string;
  time: string;
  stopsDetails: Stop[];
}

const mockFetchRouteDetails = (routeId: string | number): RouteDetails => {
  const stopsDetails: Stop[] = [
    {
      id: "1",
      order: 1,
      name: "Bến xe Hà Nội Mỹ Đình",
      address: "Tây Sơn, Đống Đa, Hà Nội",
      arrivalTime: "08:00",
      departureTime: "08:30",
      type: "start",
    },
    {
      id: "2",
      order: 2,
      name: "Trạm dừng Thanh Hóa",
      address: "Lê Lợi, Thanh Hóa",
      arrivalTime: "10:15",
      departureTime: "10:45",
      type: "stop",
    },
    {
      id: "3",
      order: 3,
      name: "Bến xe TP. Hồ Chí Minh",
      address: "Tân Bình, TP. Hồ Chí Minh",
      arrivalTime: "23:00",
      departureTime: "23:00",
      type: "end",
    },
  ];

  return {
    id: routeId,
    name: "HN - SGH",
    time: "15h 30m",
    stopsDetails,
  };
};

export default function RoutesPage(): JSX.Element {
  const [selectedRouteDetails, setSelectedRouteDetails] =
    useState<RouteDetails | null>(null);
  const [isCreateRouteOpen, setIsCreateRouteOpen] = useState(false);

  const handleViewDetails = (routeId: string | number) => {
    const details = mockFetchRouteDetails(routeId);
    setSelectedRouteDetails(details);
  };

  const handleCloseModal = () => setSelectedRouteDetails(null);

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
        <RouteTable onViewDetails={handleViewDetails} />
      </div>

      {/* Popup xem chi tiết tuyến */}
      {selectedRouteDetails && (
        <StopsModal
          routeName={selectedRouteDetails.name}
          estimatedTime={selectedRouteDetails.time}
          stops={selectedRouteDetails.stopsDetails}
          onClose={handleCloseModal}
        />
      )}

      {/* Popup tạo tuyến đường */}
      <CreateRouteModal
        isOpen={isCreateRouteOpen}
        onClose={() => setIsCreateRouteOpen(false)}
      />
    </div>
  );
}
