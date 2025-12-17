import { Outlet } from "react-router-dom"; // Nhập Outlet
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="p-6 overflow-y-auto">
          {/* Outlet sẽ tự động render các trang con tương ứng với URL */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
