import { CircleDollarSign, CreditCard, Users, RotateCcw } from "lucide-react";
import { useState } from "react";
import { StatCard } from "../../components/Admin/payment/StatCard";
import { RevenueChart } from "../../components/Admin/payment/RevenueChart";
import { PaymentMethodStats } from "../../components/Admin/payment/PaymentMethodStats";
import { TransactionTable } from "../../components/Admin/payment/TransactionTable";
import TransactionDetailModal from "../../components/Admin/payment/TransactionDetailModal";
import { paymentData } from "../../data/paymentMock";

export default function PaymentDashboard() {
  const [selectedTxn, setSelectedTxn] = useState(null);

  return (
    <div className="p-8 bg-[#fdfdfd] min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Thanh toán & Giao dịch
        </h1>
        <p className="text-gray-500 text-[13px] mt-1 font-medium">
          Quản lý toàn bộ giao dịch và thanh toán trong hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Tổng doanh thu"
          value="248,500,000 đ"
          trend="+12.5%"
          icon={<CircleDollarSign className="h-6 w-6" />}
          iconColor="emerald"
        />
        <StatCard
          title="Giao dịch thành công"
          value="1,247"
          trend="+8.2%"
          icon={<CreditCard className="h-6 w-6" />}
          iconColor="blue"
        />
        <StatCard
          title="Khách hàng mới"
          value="342"
          trend="+18.7%"
          icon={<Users className="h-6 w-6" />}
          iconColor="purple"
        />
        <StatCard
          title="Hoàn tiền"
          value="28"
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

      <TransactionTable data={paymentData} onViewDetail={setSelectedTxn} />

      <TransactionDetailModal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        data={selectedTxn}
      />
    </div>
  );
}
