import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { Revenue } from "@/types/dashboard";

interface RevenueChartProps {
  data: Revenue[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
    <h3 className="font-bold text-sm text-gray-800 mb-6 uppercase tracking-tight">
      Doanh thu theo thời gian
    </h3>
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f0f0f0"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#9ca3af" }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip formatter={(value: number | undefined) => value !== undefined ? [`${value.toLocaleString()} đ`, "Doanh thu"] : ["", "Doanh thu"]}/>
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4, fill: "#3b82f6" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <p className="text-center text-xs text-gray-400 mt-4 font-medium italic">
      Doanh thu
    </p>
  </div>
);
