import { Search } from "lucide-react";
import type { TripFilter, TripStatus } from "../../types/trip";

interface TripFilterPanelProps {
  filter: TripFilter;
  setFilter: React.Dispatch<React.SetStateAction<TripFilter>>;
}

const statusOptions: { label: string; value: TripStatus | "all" }[] = [
  { label: "Tất cả trạng thái", value: "all" },
  { label: "Sắp khởi hành", value: "scheduled" },
  { label: "Đang diễn ra", value: "on_going" },
  { label: "Đã hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "canceled" },
];

export function TripFilterPanel({ filter, setFilter }: TripFilterPanelProps) {
  const handleFilterChange = (
    key: keyof TripFilter,
    value: string | number | undefined,
  ) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilter({
      searchTerm: "",
      status: "all",
      routeId: "all",
      busCompanyId: "all",
      departureDate: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-4">
      {/* Ô tìm kiếm */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo ID, tuyến, tài xế, nhà xe..."
          value={filter.searchTerm}
          onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
        />
      </div>

      {/* Bộ lọc dropdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            value={filter.status}
            onChange={(e) =>
              handleFilterChange("status", e.target.value as TripStatus | "all")
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tuyến đường */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tuyến đường
          </label>
          <select
            value={filter.routeId}
            onChange={(e) => handleFilterChange("routeId", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">Tất cả tuyến đường</option>
            <option value="R1">Hà Nội - TP.HCM</option>
            <option value="R2">Hà Nội - Đà Nẵng</option>
            <option value="R3">Đà Nẵng - TP.HCM</option>
          </select>
        </div>

        {/* Nhà xe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nhà xe
          </label>
          <select
            value={filter.busCompanyId}
            onChange={(e) => handleFilterChange("busCompanyId", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">Tất cả nhà xe</option>
            <option value="viettrip">VietTrip Express</option>
            <option value="futa">Futa Bus</option>
            <option value="phuongtrang">Phương Trang</option>
          </select>
        </div>
      </div>

      {/* Bộ lọc ngày & khoảng giá */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ngày khởi hành */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày khởi hành
          </label>
          <input
            type="date"
            value={filter.departureDate || ""}
            onChange={(e) =>
              handleFilterChange("departureDate", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Giá từ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá từ (₫)
          </label>
          <input
            type="number"
            min="0"
            value={filter.minPrice ?? ""}
            onChange={(e) =>
              handleFilterChange(
                "minPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        {/* Giá đến */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đến (₫)
          </label>
          <input
            type="number"
            min="0"
            value={filter.maxPrice ?? ""}
            onChange={(e) =>
              handleFilterChange(
                "maxPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Nút reset */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleResetFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  );
}
