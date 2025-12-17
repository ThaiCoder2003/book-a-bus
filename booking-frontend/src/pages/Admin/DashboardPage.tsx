import MetricCard from "../../components/Admin/dashboard/MetricCard";
import WeeklyChart from "../../components/Admin/dashboard/WeeklyChart";
import TransactionFeed from "../../components/Admin/dashboard/TransactionFeed";

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Dashboard Overview */}

      <div className="flex justify-between items-center mt-2 mb-12">
        <h2 className="text-4xl font-semibold text-gray-800">
          Dashboard Overview
        </h2>

        <span className="text-sm text-gray-600">Welcome back, Admin</span>
      </div>
      {/* Top section */}
      <div className="grid grid-cols-3 gap-6">
        <MetricCard
          title="Total Revenue"
          value="15,000,000 đ"
          subtitle="+20.1% from last month"
          valueColor="text-blue-600"
        />

        <MetricCard
          title="Tickets Sold"
          value="120"
          subtitle="+15% from yesterday"
          valueColor="text-orange-500"
        />

        <MetricCard
          title="Buses Running"
          value="5 Running"
          subtitle="2 in maintenance"
          valueColor="text-green-500"
        />
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <WeeklyChart />
        </div>

        <TransactionFeed />
      </div>
    </div>
  );
}
