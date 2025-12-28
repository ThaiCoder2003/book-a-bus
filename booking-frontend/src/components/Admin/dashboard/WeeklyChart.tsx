import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface WeeklyChartProps {
  data: { label: string; revenue: number }[];
}

export default function WeeklyChart({data}:  WeeklyChartProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border h-120">
      <h3 className="font-semibold mb-4">Weekly Revenue</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
