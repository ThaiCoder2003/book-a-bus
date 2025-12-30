import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  iconColor: string; // ví dụ: "emerald", "blue", "purple", "orange"
  isNegative?: boolean;
}

const COLOR_MAPS = {
  emerald: {
    bg: "bg-emerald-50",       // Nền rất nhạt để làm nổi bật icon
    iconBg: "bg-emerald-100",  // Nền icon đậm hơn một chút
    text: "text-emerald-600",  // Màu chữ/icon chính
    trend: "text-emerald-600"  // Màu xu hướng tích cực
  },
  blue: {
    bg: "bg-blue-50",
    iconBg: "bg-blue-100",
    text: "text-blue-600",
    trend: "text-blue-600"
  },
  purple: {
    bg: "bg-purple-50",
    iconBg: "bg-purple-100",
    text: "text-purple-600",
    trend: "text-purple-600"
  },
  orange: {
    bg: "bg-orange-50",
    iconBg: "bg-orange-100",
    text: "text-orange-600",
    trend: "text-orange-600"
  },
};

export const StatCard = ({
  title,
  value,
  trend,
  icon,
  iconColor,
  isNegative = false,
}: StatCardProps) => {
  const selectedColor = COLOR_MAPS[iconColor as keyof typeof COLOR_MAPS] || COLOR_MAPS.emerald;
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden">
      {/* Icon góc phải, nền mờ */}
      <div
        className={`absolute top-4 right-4 p-2.5 rounded-lg flex items-center justify-center ${selectedColor?.bg || ""}`}
        style={{ opacity: 0.4 }} // tạo độ mờ dịu
      >
        <div className={`${selectedColor.text}`}>{icon}</div>
      </div>

      {/* Nội dung chính */}
      <div className="flex flex-col justify-end h-full">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>

        {/* Trend */}
        <div
          className={`flex items-center text-[13px] font-medium mt-1 ${
            isNegative ? "text-red-500" : "text-emerald-600"
          }`}
        >
          {trend.includes("-") ? (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          )}
          
          {trend}
        </div>
      </div>
    </div>
  );
};
