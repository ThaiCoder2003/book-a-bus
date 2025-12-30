import MetricCard from "../../components/Admin/dashboard/MetricCard";
import WeeklyChart from "../../components/Admin/dashboard/WeeklyChart";
import TransactionFeed from "../../components/Admin/dashboard/TransactionFeed";
import { useEffect, useState } from "react";
import dashboardService from "@/services/dashboardService";

import type { TransactionUI } from "@/types/ui/transaction.ui";
import type { DashboardSummary, WeeklyChartData } from "@/types/admin/dashboard";
  export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyChartData[]>([]);
  const [recentBooking, setRecentBooking] = useState<TransactionUI[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        document.title = "Admin Dashboard - Book A Bus";
  
        const [
          summaryResponse,
          weeklyResponse,
          recentBookingResponse,
        ] = await Promise.all([
          dashboardService.summary(),
          dashboardService.WeeklyChart(),
          dashboardService.recentBooking()
        ]);

        setSummary(summaryResponse)
        setWeeklyData(weeklyResponse)
        setRecentBooking(recentBookingResponse)
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="p-8 space-y-6">
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
          value={summary?.revenue ?? 0}
          subtitle={`${(summary?.revenueGrowth ?? 0) > 0 ? '+' : ''}${summary?.revenueGrowth}% from last month`}
          valueColor="text-blue-600"
          formatter={(val) => `${val.toLocaleString("vi-VN")} đ`}
        />

        <MetricCard
          title="Tickets Sold"
          value={summary?.tickets ?? 0}
          subtitle={`${(summary?.ticketGrowth ?? 0) > 0 ? '+' : ''}${summary?.ticketGrowth}% from yesterday`}
          valueColor="text-orange-500"
        />

        <MetricCard
          title="Buses Running"
          value={summary?.busCount ?? 0}
          formatter={(v) => `${v} Running`}
          subtitle="2 in maintenance"
          valueColor="text-green-500"
        />
      </div>

      {/* Middle section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <WeeklyChart data={weeklyData || []}/>
        </div>
        <TransactionFeed 
         data={recentBooking || []}
        />
      </div>
    </div>
  );
}
