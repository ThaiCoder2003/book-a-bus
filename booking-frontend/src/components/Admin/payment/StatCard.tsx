import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  iconColor: string; // ví dụ: "emerald", "blue", "purple", "orange"
  isNegative?: boolean;
}

export const StatCard = ({
  title,
  value,
  trend,
  icon,
  iconColor,
  isNegative = false,
}: StatCardProps) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-[140px] relative overflow-hidden">
    {/* Icon góc phải, nền mờ */}
    <div
      className={`absolute top-4 right-4 p-2.5 rounded-lg bg-${iconColor}-100 flex items-center justify-center`}
      style={{ opacity: 0.4 }} // tạo độ mờ dịu
    >
      <div className={`text-${iconColor}-600`}>{icon}</div>
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
        {isNegative ? (
          <ArrowDownRight className="h-4 w-4 mr-1" />
        ) : (
          <ArrowUpRight className="h-4 w-4 mr-1" />
        )}
        {trend}
      </div>
    </div>
  </div>
);
