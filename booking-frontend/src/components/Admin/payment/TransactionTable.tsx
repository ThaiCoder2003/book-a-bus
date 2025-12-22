import React, { useState, useMemo } from "react";
import { Search, Download, Eye, RotateCcw, ChevronDown } from "lucide-react";

export const TransactionTable = ({ data, onViewDetail }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [method, setMethod] = useState("Tất cả phương thức");
  const [status, setStatus] = useState("Tất cả trạng thái");
  const [dateRange, setDateRange] = useState("Thời gian");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });

  // Lọc dữ liệu
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      // Search
      const searchMatch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Method filter
      const methodMatch =
        method === "Tất cả phương thức" || item.method === method;

      // Status filter
      const statusMatch =
        status === "Tất cả trạng thái" || item.status === status;

      // Date filter
      const itemDate = new Date(item.time);
      const now = new Date();
      let dateMatch = true;

      if (dateRange === "Hôm nay") {
        dateMatch = itemDate.toDateString() === now.toDateString();
      } else if (dateRange === "7 ngày qua") {
        const past = new Date();
        past.setDate(now.getDate() - 7);
        dateMatch = itemDate >= past && itemDate <= now;
      } else if (dateRange === "30 ngày qua") {
        const past = new Date();
        past.setDate(now.getDate() - 30);
        dateMatch = itemDate >= past && itemDate <= now;
      } else if (dateRange === "90 ngày qua") {
        const past = new Date();
        past.setDate(now.getDate() - 90);
        dateMatch = itemDate >= past && itemDate <= now;
      } else if (
        dateRange === "Tùy chỉnh" &&
        customRange.from &&
        customRange.to
      ) {
        const fromDate = new Date(customRange.from);
        const toDate = new Date(customRange.to);
        dateMatch = itemDate >= fromDate && itemDate <= toDate;
      }

      return searchMatch && methodMatch && statusMatch && dateMatch;
    });
  }, [data, searchTerm, method, status, dateRange, customRange]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-visible mt-6">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-4 flex-1 flex-wrap">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Tìm mã giao dịch, khách hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <FilterDropdown
            label={method}
            options={[
              "Tất cả phương thức",
              "MoMo",
              "Thẻ ngân hàng",
              "Quét QR",
              "PayOS",
            ]}
            onSelect={setMethod}
          />
          <FilterDropdown
            label={status}
            options={[
              "Tất cả trạng thái",
              "Hoàn thành",
              "Đang xử lý",
              "Thất bại",
              "Đã hoàn tiền",
            ]}
            onSelect={setStatus}
          />
          <FilterDropdown
            label={dateRange}
            options={[
              "Thời gian",
              "Hôm nay",
              "7 ngày qua",
              "30 ngày qua",
              "90 ngày qua",
              "Tùy chỉnh",
            ]}
            onSelect={setDateRange}
          />

          {dateRange === "Tùy chỉnh" && (
            <div className="relative left-224 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="date"
                className="border border-gray-200 rounded-lg px-2 py-1"
                value={customRange.from}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, from: e.target.value }))
                }
              />
              <span>đến</span>
              <input
                type="date"
                className="border border-gray-200 rounded-lg px-2 py-1"
                value={customRange.to}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, to: e.target.value }))
                }
              />
            </div>
          )}
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
          <Download className="h-4 w-4" /> Xuất báo cáo
        </button>
      </div>

      {/* Table */}

      <div className="relative overflow-x-auto z-0 overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Mã giao dịch</th>
              <th className="px-6 py-4">Khách hàng</th>
              <th className="px-6 py-4">Tuyến đường</th>
              <th className="px-6 py-4">Số tiền</th>
              <th className="px-6 py-4 text-center">Phương thức</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-center">Thời gian</th>{" "}
              <th className="px-6 py-4 text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filteredData.length > 0 ? (
              filteredData.map((item: any) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">
                    {item.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-bold text-gray-800">
                      {item.customer}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {item.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-600 font-medium">
                    {item.route}
                  </td>
                  <td className="px-6 py-4 text-[13px] font-bold text-gray-900">
                    {item.amount.toLocaleString()} đ
                  </td>
                  <td className="px-6 py-4 text-[13px] text-gray-500 text-center">
                    {item.method}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-[12px] text-gray-500 text-center">
                    {new Date(item.time).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>{" "}
                  {/* ✅ hiện thời gian */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400">
                  Không có giao dịch nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Dropdown Component
const FilterDropdown = ({
  label,
  options,
  onSelect,
}: {
  label: string;
  options: string[];
  onSelect: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        className="flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl text-[12px] font-medium text-gray-600 shadow-sm hover:border-gray-300 w-[200px]"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">{label}</span>
        <ChevronDown className="h-3 w-3 text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-50 text-sm w-full">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => {
                onSelect(opt);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                opt === label ? "text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Status badge
const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    "Hoàn thành": "bg-blue-100 text-blue-700",
    "Đang xử lý": "bg-gray-100 text-gray-500",
    "Thất bại": "bg-red-100 text-red-600",
    "Đã hoàn tiền": "bg-orange-100 text-orange-600",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
};
