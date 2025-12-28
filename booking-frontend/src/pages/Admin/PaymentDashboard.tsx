"use client";

import { useState, useMemo, useRef } from "react";
import { CircleDollarSign, CreditCard, Users, RotateCcw } from "lucide-react";

import { StatCard } from "../../components/Admin/payment/StatCard";
import { RevenueChart } from "../../components/Admin/payment/RevenueChart";
import { PaymentMethodStats } from "../../components/Admin/payment/PaymentMethodStats";
import { TransactionTable } from "../../components/Admin/payment/TransactionTable";
import TransactionDetailModal from "../../components/Admin/payment/TransactionDetailModal";

import { paymentMock } from "../../data/paymentMock";
import type { Booking } from "../../types/booking.type";

export default function PaymentDashboard() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const nowRef = useRef<number>(Date.now());

  const totalRevenue = useMemo(() => {
    return paymentMock.reduce(
      (sum, b) => sum + (b.status === "CONFIRMED" ? b.totalAmount : 0),
      0,
    );
  }, []);

  const successfulTxns = useMemo(
    () => paymentMock.filter((b) => b.status === "CONFIRMED").length,
    [],
  );

  const refunds = useMemo(
    () => paymentMock.filter((b) => b.status === "CANCELLED").length,
    [],
  );

  const newCustomers = useMemo(() => {
    return paymentMock.filter((b) => {
      const createdAt = new Date(b.user?.createdAt ?? b.createdAt);
      const diffDays =
        (nowRef.current - createdAt.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    }).length;
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
          value={`${totalRevenue.toLocaleString("vi-VN")} đ`}
          trend="+12.5%"
          icon={<CircleDollarSign className="h-6 w-6" />}
          iconColor="emerald"
        />
        <StatCard
          title="Giao dịch thành công"
          value={successfulTxns.toString()}
          trend="+8.2%"
          icon={<CreditCard className="h-6 w-6" />}
          iconColor="blue"
        />
        <StatCard
          title="Khách hàng mới"
          value={newCustomers.toString()}
          trend="+18.7%"
          icon={<Users className="h-6 w-6" />}
          iconColor="purple"
        />
        <StatCard
          title="Hoàn tiền"
          value={refunds.toString()}
          trend="-5.3%"
          icon={<RotateCcw className="h-6 w-6" />}
          iconColor="orange"
          isNegative
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PaymentMethodStats />
      </div>

      <TransactionTable data={paymentMock} onViewDetail={setSelectedBooking} />

      <TransactionDetailModal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        data={selectedBooking}
      />
    </div>
  );
}
