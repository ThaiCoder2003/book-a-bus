import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import FleetManagementPage from "@/pages/FleetManagementPage";
import BookingManagementPage from "@/pages/BookingManagementPage";
import { TripManagementPage } from "@/pages/TripManagementPage";
import RoutesPage from "@/pages/RoutesPage";

export default function AdminRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/fleets" element={<FleetManagementPage />} />
        <Route path="/admin/trips" element={<TripManagementPage />} />
        <Route path="/admin/bookings" element={<BookingManagementPage />} />
        <Route path="/admin/routes" element={<RoutesPage />} />
      </Routes>
    </MainLayout>
  );
}
