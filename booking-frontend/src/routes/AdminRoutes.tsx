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
        {/* Thêm dòng này: Nếu vào link linh tinh trong /admin, nó vẫn hiện Header và báo lỗi 404 */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-2xl font-bold">
                404 - Trang này đang phát triển
              </h2>
              <p>Vui lòng quay lại sau!</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
