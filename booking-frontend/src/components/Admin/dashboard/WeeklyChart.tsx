import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { WEEKLY_REVENUE_MOCK } from "@/data/weekly-revenue.mock";
import { mapWeeklyRevenueApiToUI } from "./weeklyRevenue.mapper";

export default function WeeklyChart() {
  const data = mapWeeklyRevenueApiToUI(WEEKLY_REVENUE_MOCK);

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border"
      style={{ height: 400 }}
    >
      <h3 className="font-semibold mb-4">Weekly Revenue</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis tickFormatter={(v) => `${v / 1_000_000}M`} />
          <Tooltip
            formatter={(value) => {
              if (typeof value !== "number") return value;
              return value.toLocaleString("vi-VN") + " đ";
            }}
          />
          <Bar
            dataKey="revenue"
            fill="#1d4ed8" // ✅ blue giống lúc đầu
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
