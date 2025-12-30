"use client";

import { useState, useEffect } from "react";
import { CircleDollarSign, CreditCard, Users, RotateCcw } from "lucide-react";

import { StatCard } from "../../components/Admin/payment/StatCard";
import { RevenueChart } from "../../components/Admin/payment/RevenueChart";
import { PaymentMethodStats } from "../../components/Admin/payment/PaymentMethodStats";
import { TransactionTable } from "../../components/Admin/payment/TransactionTable";
import TransactionDetailModal from "../../components/Admin/payment/TransactionDetailModal";
import dashboardService from "@/services/dashboardService";

import type { FinanceAnalysis, Revenue } from "@/types/admin/dashboard";

import type { Booking } from "../../types/booking.type";

export default function PaymentDashboard() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [financeStat, setFinanceStat] = useState<FinanceAnalysis | null>(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState<Revenue[]>([])
  const [booking, setBooking] = useState<Booking[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        document.title = "Admin Dashboard - Payment Management";
    
        const [
          financeResponse,
          revenueResponse,
          bookingResponse,
        ] = await Promise.all([
          dashboardService.getFinanceAnalysis(),
          dashboardService.getMonthlyRevenue(),
          dashboardService.getTransactions()
        ]);

        setFinanceStat(financeResponse)
        setMonthlyRevenue(revenueResponse)
        setBooking(bookingResponse)
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen">
      <h1 className="text-2xl font-bold mb-1">Thanh toán & Giao dịch</h1>
      <p className="text-gray-500 text-sm mb-8">
        Quản lý toàn bộ giao dịch trong hệ thống
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng doanh thu"
          value={`${Number(financeStat?.revenue || 0).toLocaleString("vi-VN")} đ`}
          trend={`${(financeStat?.revenueGrowth || 0) >= 0 ? '+' : ''}${financeStat?.revenueGrowth || 0}%`}
          icon={<CircleDollarSign className="h-6 w-6" />}
          iconColor="emerald"
          isNegative={(financeStat?.revenueGrowth || 0) < 0}
        />
        <StatCard
          title="Giao dịch thành công"
          value={Number(financeStat?.successfulBooking || 0).toLocaleString("vi-VN")}
          trend={`${(financeStat?.successfulBookingGrowth || 0) >= 0 ? '+' : ''}${financeStat?.successfulBookingGrowth || 0}%`}
          icon={<CreditCard className="h-6 w-6" />}
          iconColor="blue"
          isNegative={(financeStat?.successfulBookingGrowth || 0) < 0}
        />
        <StatCard
          title="Khách hàng mới"
          value={Number(financeStat?.newUsers || 0).toLocaleString("vi-VN")}
          trend={`${(financeStat?.customerTrend || 0) >= 0 ? '+' : ''}${financeStat?.customerTrend || 0}%`}
          icon={<Users className="h-6 w-6" />}
          iconColor="purple"
          isNegative={(financeStat?.customerTrend || 0) < 0}
        />
        <StatCard
          title="Hoàn tiền"
          value={Number(financeStat?.refundThisMonth || 0).toLocaleString("vi-VN")}
          trend={`${(financeStat?.refundTrend || 0) >= 0 ? '+' : ''}${financeStat?.refundTrend || 0}%`}
          icon={<RotateCcw className="h-6 w-6" />}
          iconColor="orange"
          isNegative={(financeStat?.refundTrend || 0) > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart data={monthlyRevenue || []} />
        </div>
        <PaymentMethodStats />
      </div>

      <TransactionTable data={booking} onViewDetail={setSelectedBooking} />

      <TransactionDetailModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        data={selectedBooking}
      />
    </div>
  );
}
