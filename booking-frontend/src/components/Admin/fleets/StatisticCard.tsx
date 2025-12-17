import React from "react";

interface StatisticCardProps {
  title: string;
  value: number;
  colorClass?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  colorClass = "text-gray-900",
}) => {
  const borderClass =
    title === "Đang hoạt động"
      ? "border-l-4 border-green-500"
      : title === "Đang bảo trì"
      ? "border-l-4 border-red-500"
      : title === "Tổng số ghế"
      ? "border-l-4 border-violet-500" // 💜 chỉnh lại màu viền đúng như ảnh mẫu
      : "border-l-4 border-blue-500";

  return (
    <div
      className={`flex flex-col p-4 bg-white rounded-xl shadow-md min-w-[200px] ${borderClass}`}
    >
      <span className="text-sm font-medium text-gray-500 mb-6">{title}</span>
      <span className={`mt-1 text-3xl font-bold ${colorClass}`}>{value}</span>
    </div>
  );
};

export default StatisticCard;
