import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Bus,
  CalendarDays,
  BookOpen,
  Users,
  BarChart4,
  MessageSquareText,
  Settings,
  CreditCard,
  Bell,
  Bot,
  Shield,
} from "lucide-react";

// -----------------------------------------------------------
// 1. ICON
// -----------------------------------------------------------
const getLucideIcon = (name) => {
  switch (name) {
    case "Tổng quan":
      return <LayoutDashboard className="h-5 w-5" />;
    case "Tuyến đường & Điểm dừng":
      return <Map className="h-5 w-5" />;
    case "Lịch trình Chuyến đi":
      return <CalendarDays className="h-5 w-5" />;
    case "Đội xe & Cấu hình Ghế":
      return <Bus className="h-5 w-5" />;
    case "Quản lý đặt chỗ":
      return <BookOpen className="h-5 w-5" />;
    case "Thanh toán & Giao dịch":
      return <CreditCard className="h-5 w-5" />;
    case "Quản lý Người dùng":
      return <Users className="h-5 w-5" />;
    case "Đánh giá & Phản hồi":
      return <MessageSquareText className="h-5 w-5" />;
    case "Thông báo":
      return <Bell className="h-5 w-5" />;
    case "Trợ lý ảo (AI Assistant)":
      return <Bot className="h-5 w-5" />;
    case "Phân quyền & Vai trò":
      return <Shield className="h-5 w-5" />;
    case "Báo cáo Doanh thu":
      return <BarChart4 className="h-5 w-5" />;
    case "Cài đặt Hệ thống":
      return <Settings className="h-5 w-5" />;
    default:
      return null;
  }
};

// -----------------------------------------------------------
// 2. MENU (Hoàn chỉnh theo scope dự án 5 tuần)
// -----------------------------------------------------------
const AdminMenus = [
  {
    title: "Chức năng Chính",
    items: [
      { name: "Tổng quan", path: "/admin" },
      { name: "Quản lý đặt chỗ", path: "/admin/bookings" },
      { name: "Thanh toán & Giao dịch", path: "/admin/payments" },
    ],
  },
  {
    title: "Quản lý Vận hành",
    items: [
      { name: "Tuyến đường & Điểm dừng", path: "/admin/routes" },
      { name: "Lịch trình Chuyến đi", path: "/admin/trips" },
      { name: "Đội xe & Cấu hình Ghế", path: "/admin/fleets" },
    ],
  },
  {
    title: "Quản lý Khách hàng",
    items: [
      { name: "Quản lý Người dùng", path: "/admin/users" },
      { name: "Đánh giá & Phản hồi", path: "/admin/reviews" },
      { name: "Thông báo", path: "/admin/notifications" },
    ],
  },
  {
    title: "Phân tích & Hệ thống",
    items: [
      { name: "Báo cáo Doanh thu", path: "/admin/analytics" },
      { name: "Trợ lý ảo (AI Assistant)", path: "/admin/assistant" },
      { name: "Phân quyền & Vai trò", path: "/admin/roles" },
      { name: "Cài đặt Hệ thống", path: "/admin/settings" },
    ],
  },
];

// -----------------------------------------------------------
// 3. COMPONENT: Sidebar
// -----------------------------------------------------------
export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-5 space-y-4 shadow-lg">
      <h1 className="text-xl font-bold text-blue-600 flex items-center space-x-2 pb-4 border-b">
        <Bus className="h-6 w-6" />
        <span>BusAdmin Panel</span>
      </h1>

      <nav className="flex flex-col space-y-4">
        {AdminMenus.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-1">
            <h3 className="text-xs font-bold uppercase text-gray-400 px-2 pt-2">
              {section.title}
            </h3>

            {section.items.map((m) => (
              <NavLink
                key={m.path}
                to={m.path}
                end={m.name === "Tổng quan"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg hover:bg-blue-50 flex items-center space-x-3 transition-colors text-sm ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-semibold"
                      : "text-gray-600"
                  }`
                }
              >
                {getLucideIcon(m.name)}
                <span>{m.name}</span>
              </NavLink>
            ))}

            {sectionIndex < AdminMenus.length - 1 && (
              <hr className="my-2 border-gray-100" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
