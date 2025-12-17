import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", revenue: 2 },
  { name: "Tue", revenue: 1.5 },
  { name: "Wed", revenue: 2.5 },
  { name: "Thu", revenue: 1.8 },
  { name: "Fri", revenue: 4 },
  { name: "Sat", revenue: 5.5 },
  { name: "Sun", revenue: 6 },
];

export default function WeeklyChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border h-120">
      <h3 className="font-semibold mb-4">Weekly Revenue</h3>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="revenue" fill="#1d4ed8" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
