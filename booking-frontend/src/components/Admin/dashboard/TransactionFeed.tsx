import { BOOKING_STATUS_UI } from "./TransactionFeed.status";
import type { TransactionUI } from "@/types/ui/transaction.ui";

interface Props {
  data: TransactionUI[]; 
}

export default function TransactionFeed({data}: Props) {
  return (
    <div
      className="bg-white p-6 rounded-xl shadow-sm border"
      style={{ height: 400 }}
    >
      <h3 className="font-semibold mb-4">Recent Transactions</h3>

      <div className="h-80 overflow-y-auto custom-scrollbar">
        {data.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-10">No recent bookings</p>
        ) : (
          <ul className="space-y-4">
            {data.map((item: TransactionUI) => {
              const statusUI = BOOKING_STATUS_UI[item.status];

              return (
                <li key={item.id} className="flex justify-between items-center">
                  {/* User info */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                      {item.user.name.slice(-1)}
                    </div>
                    <div>
                      <div className="font-medium">{item.user.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.user.email}
                      </div>
                    </div>
                  </div>

                  {/* Amount & status */}
                  <div className="flex flex-col items-end space-y-1">
                    <span className="font-semibold">
                      {Number(item.totalAmount).toLocaleString("vi-VN")} đ
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusUI.className}`}
                    >
                      {statusUI.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
