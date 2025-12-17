import { Routes, Route } from "react-router-dom";
import MainLayout from "@/components/Admin/layout/MainLayout";
import DashboardPage from "@/pages/Admin/DashboardPage";
import FleetManagementPage from "@/pages/Admin/FleetManagementPage";
import BookingManagementPage from "@/pages/Admin/BookingManagementPage";
import { TripManagementPage } from "@/pages/Admin/TripManagementPage";
import RoutesPage from "@/pages/Admin/RoutesPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} /> {/* /admin */}
        <Route path="fleets" element={<FleetManagementPage />} />{" "}
        {/* /admin/fleets */}
        <Route path="trips" element={<TripManagementPage />} />{" "}
        {/* /admin/trips */}
        <Route path="bookings" element={<BookingManagementPage />} />{" "}
        {/* /admin/bookings */}
        <Route path="routes" element={<RoutesPage />} /> {/* /admin/routes */}
      </Route>
    </Routes>
  );
}
