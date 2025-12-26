import { useState, useMemo } from "react";
import { Search, Eye } from "lucide-react";
import type { Booking } from "../../../types/booking.type";

export const TransactionTable = ({
  data,
  onViewDetail,
}: {
  data: Booking[];
  onViewDetail: (b: Booking) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((b) => {
      const keyword = searchTerm.toLowerCase();

      return (
        b.id.toLowerCase().includes(keyword) ||
        b.user?.name?.toLowerCase().includes(keyword) ||
        b.user?.email?.toLowerCase().includes(keyword) ||
        b.trip?.route?.name?.toLowerCase().includes(keyword)
      );
    });
  }, [data, searchTerm]);

  return (
    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
      <div className="p-6 border-b flex items-center gap-4">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2 w-full bg-gray-50 border rounded-xl text-sm"
            placeholder="Tìm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[10px]">
            <tr className="whitespace-nowrap">
              <th className="px-6 py-4 text-left">Mã</th>
              <th className="px-6 py-4 text-left">Khách hàng</th>
              <th className="px-6 py-4 text-left">Tuyến</th>
              <th className="px-6 py-4 text-left">Số tiền</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thời gian</th>
              <th className="px-6 py-4 text-center">Chi tiết</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredData.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-semibold text-left">
                  {b.id}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="font-medium">{b.user?.name}</div>
                  <div className="text-xs text-gray-400">{b.user?.email}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-left">
                  <div className="leading-tight">
                    <div className="font-medium truncate max-w-40">
                      {b.user?.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-40">
                      {b.user?.email}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 font-bold whitespace-nowrap text-left">
                  {b.totalAmount.toLocaleString()} đ
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <StatusBadge status={b.status} />
                </td>

                <td className="px-6 py-4 text-center text-xs text-gray-500 whitespace-nowrap">
                  {new Date(b.paymentTime ?? b.createdAt).toLocaleString(
                    "vi-VN",
                  )}
                </td>

                <td className="px-6 py-4 text-center whitespace-nowrap">
                  <button
                    disabled={b.status !== "CONFIRMED"}
                    onClick={() => onViewDetail(b)}
                    className={`p-2 rounded-lg
                      ${
                        b.status === "CONFIRMED"
                          ? "hover:bg-blue-50"
                          : "opacity-40 cursor-not-allowed"
                      }
                    `}
                  >
                    <Eye className="h-4 w-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    CONFIRMED: "bg-emerald-100 text-emerald-600",
    PENDING: "bg-gray-100 text-gray-500",
    CANCELLED: "bg-orange-100 text-orange-600",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-[10px] font-bold ${map[status]}`}
    >
      {status === "CONFIRMED"
        ? "Hoàn thành"
        : status === "CANCELLED"
        ? "Đã hoàn tiền"
        : "Chưa thanh toán"}
    </span>
  );
};
