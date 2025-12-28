import { DollarSign, Ticket, Bus } from "lucide-react";

// 1. Định nghĩa Interface đầy đủ
interface MetricCardProps {
  title: string;
  value: number;
  subtitle?: string;
  valueColor?: string;
  formatter?: (value: number) => string;
}

const getMetricIcon = (title: string) => {
  const iconClass = "h-4 w-4 text-gray-400";
  switch (title) {
    case "Total Revenue":
      return <DollarSign className={iconClass} />;
    case "Tickets Sold":
      return <Ticket className={iconClass} />;
    case "Buses Running":
      return <Bus className={iconClass} />;
    default:
      return null;
  }
};

export default function MetricCard({
  title,
  value,
  subtitle,
  valueColor,
  formatter,
}: MetricCardProps) {

  const isPositive = subtitle?.startsWith('+') || false;
  const isNegative = subtitle?.startsWith('-') || false;

  // Xác định màu sắc dựa trên dấu
  const trendClass = isPositive 
    ? "text-green-600" 
    : isNegative 
    ? "text-red-600" 
    : "text-gray-500";

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        {getMetricIcon(title)}
      </div>

      <div>
        <h3 className={`text-2xl font-bold ${valueColor ?? "text-gray-900"}`}>
          {formatter ? formatter(value) : value.toLocaleString()}
        </h3>
        {subtitle && <p className={`text-xs ${trendClass}`}>{subtitle}</p>}
      </div>
    </div>
  );
}
