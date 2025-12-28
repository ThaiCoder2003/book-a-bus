import { DollarSign, Ticket, Bus } from "lucide-react";

interface Props {
  title: string;
  value: string;
  subtitle: string;
  valueColor: string;
  trendValue?: number;
}

const getMetricIcon = (title: String) => {
  switch (title) {
    case "Total Revenue":
      return <DollarSign className="h-4 w-4 text-gray-400" />;
    case "Tickets Sold":
      return <Ticket className="h-4 w-4 text-gray-400" />;
    case "Buses Running":
      return <Bus className="h-4 w-4 text-gray-400" />;
    default:
      return null;
  }
};

export default function MetricCard({
  title,
  value,
  subtitle,
  valueColor,
}: Props) {

  const isPositive = subtitle.startsWith('+');
  const isNegative = subtitle.startsWith('-');

  // Xác định màu sắc dựa trên dấu
  const trendClass = isPositive 
    ? "text-green-600" 
    : isNegative 
    ? "text-red-600" 
    : "text-gray-500";

    
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-8">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div>{getMetricIcon(title)}</div>
      </div>

      <h3
        className={`text-2xl font-bold ${
          valueColor ? valueColor : "text-gray-900"
        }`}
      >
        {value}
      </h3>
      <p className={`text-xs ${trendClass}`}>{subtitle}</p>
    </div>
  );
}
