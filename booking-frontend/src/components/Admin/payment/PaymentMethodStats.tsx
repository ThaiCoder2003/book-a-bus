const methods = [
  {
    label: "ZaloPay Sandbox",
    percentage: 100,
    amount: "22.000.000 đ",
    color: "bg-blue-600",
  },
  {
    label: "Thẻ ngân hàng",
    percentage: 0,
    amount: "0 đ",
    color: "bg-blue-400",
  },
  {
    label: "QR Code",
    percentage: 0,
    amount: "0 đ",
    color: "bg-indigo-500",
  },
  {
    label: "ZaloPay Sandbox",
    percentage: 0,
    amount: "0 đ",
    color: "bg-gray-300",
  },
];

export const PaymentMethodStats = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
    <h3 className="font-bold text-sm text-gray-800 mb-8 uppercase tracking-tight">
      Phương thức thanh toán
    </h3>
    <div className="space-y-7">
      {methods.map((m) => (
        <div key={m.label}>
          <div className="flex justify-between text-[13px] mb-2 font-medium">
            <span className="text-gray-700">{m.label}</span>
            <span className="text-gray-400">{m.percentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className={`${m.color} h-1.5 rounded-full transition-all duration-1000`}
              style={{ width: `${m.percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5 font-medium">
            {m.amount}
          </p>
        </div>
      ))}
    </div>
  </div>
);
