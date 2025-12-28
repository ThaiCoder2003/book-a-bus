import MetricCard from "../../components/Admin/dashboard/MetricCard";
import WeeklyChart from "../../components/Admin/dashboard/WeeklyChart";
import TransactionFeed from "../../components/Admin/dashboard/TransactionFeed";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [recentBooking, setRecentBooking] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        document.title = "Admin Dashboard - Book A Bus";
  
        const token = localStorage.getItem("accessToken");

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        
      const [
        summaryResponse,
        weeklyResponse,
        recentBookingResponse,
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/summary`, { headers }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/weekly-chart`, { headers }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/recent-bookings`, { headers }),
      ]);

      setSummary(summaryResponse.data)
      setWeeklyData(weeklyResponse.data)
      setRecentBooking(recentBookingResponse.data)
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      }
    };

    fetchData();
  }, []);
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
          value={`${summary?.revenue?.toLocaleString() ?? 0} đ`}
          subtitle={`${summary?.revenueGrowth > 0 ? '+' : ''}${summary?.revenueGrowth}% from last month`}
          valueColor="text-blue-600"
        />

        <MetricCard
          title="Tickets Sold"
          value={summary?.tickets?.toString() ?? 0}
          subtitle={`${summary?.ticketGrowth > 0 ? '+' : ''}${summary?.ticketGrowth}% from yesterday`}
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
          <WeeklyChart data={weeklyData || []}/>
        </div>

        <TransactionFeed />
      </div>
    </div>
  );
}
