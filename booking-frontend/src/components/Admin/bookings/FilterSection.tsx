// FilterSection.tsx
import React, { useState, forwardRef } from "react";
import { ChevronUp, ChevronDown, Calendar } from "lucide-react";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

export interface Filters {
  status?: "CONFIRMED" | "PENDING" | "CANCELLED";
  route?: string;
  startDate?: string;
  endDate?: string;
}

interface FilterSectionProps {
  onFilterChange?: (filters: Filters) => void;
}

const CustomDateInput = forwardRef(
  (
    {
      value,
      onClick,
      placeholder,
    }: { value?: string; onClick?: () => void; placeholder?: string },
    ref: any,
  ) => (
    <div className="relative w-full">
      <input
        ref={ref}
        value={value || ""}
        onClick={onClick}
        readOnly
        placeholder={placeholder || "dd/mm/yyyy"}
        className="w-full h-10 p-2 pl-4 pr-9 border border-gray-300 rounded-md text-sm text-gray-700 bg-white cursor-pointer focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
      />
      <button
        type="button"
        onClick={onClick}
        className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
      >
        <Calendar className="h-4 w-4 text-gray-400" />
      </button>
    </div>
  ),
);

const FilterButton: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-sm rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap ${
      active
        ? "bg-blue-600 text-white shadow-md"
        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusMap: Record<string, Filters["status"] | undefined> = {
    "Tất cả": undefined,
    "Đã xác nhận": "CONFIRMED",
    "Đang chờ": "PENDING",
    "Đã hủy": "CANCELLED",
  };

  const routeOptions = [
    "Tất cả",
    "Hà Nội - TPHCM",
    "Hà Nội - Hải Phòng",
    "TPHCM - Cần Thơ",
  ];

  const [filters, setFilters] = useState<{
    status?: Filters["status"];
    route: string;
    startDate?: string;
    endDate?: string;
  }>({
    route: "Tất cả",
  });

  const updateFilter = (key: keyof Filters, value?: string) => {
    let val: Filters["status"] | string | undefined = value;
    if (key === "status") val = statusMap[value ?? "Tất cả"];

    const newFilters = { ...filters, [key]: val };
    setFilters(newFilters);

    onFilterChange?.({
      status: newFilters.status,
      route: newFilters.route === "Tất cả" ? undefined : newFilters.route,
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
    });
  };

  const resetFilters = () => {
    const defaultFilters = {
      status: undefined,
      route: "Tất cả",
      startDate: undefined,
      endDate: undefined,
    };
    setFilters(defaultFilters);
    onFilterChange?.({
      status: undefined,
      route: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 rounded-lg shadow-sm">
      <div
        className="flex justify-between items-center cursor-pointer p-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-base font-bold text-blue-600">Bộ lọc</h2>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-blue-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-600" />
        )}
      </div>

      {isExpanded && (
        <div className="space-y-4 p-4 pt-4 border-t border-gray-200">
          {/* Trạng thái */}
          <div>
            <p className="text-sm font-medium mb-2 text-gray-700">
              Trạng thái đặt vé
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(statusMap).map((status) => (
                <FilterButton
                  key={status}
                  label={status}
                  active={filters.status === statusMap[status]}
                  onClick={() => updateFilter("status", status)}
                />
              ))}
            </div>
          </div>

          {/* Tuyến đường */}
          <div>
            <p className="text-sm font-medium mb-2 text-gray-700">
              Tuyến đường
            </p>
            <div className="flex flex-wrap gap-2">
              {routeOptions.map((route) => (
                <FilterButton
                  key={route}
                  label={route}
                  active={filters.route === route}
                  onClick={() => updateFilter("route", route)}
                />
              ))}
            </div>
          </div>

          {/* Khoảng ngày */}
          <div>
            <p className="text-sm font-medium mb-2 text-gray-700">
              Khoảng ngày
            </p>
            <div className="flex gap-3">
              {/* Start date */}
              <div className="w-1/2">
                <ReactDatePicker
                  selected={
                    filters.startDate ? new Date(filters.startDate) : undefined
                  }
                  onChange={(date) => {
                    if (!date) return updateFilter("startDate", undefined);
                    updateFilter("startDate", format(date, "yyyy-MM-dd"));
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  customInput={<CustomDateInput placeholder="dd/mm/yyyy" />}
                />
              </div>

              {/* End date */}
              <div className="w-1/2">
                <ReactDatePicker
                  selected={
                    filters.endDate ? new Date(filters.endDate) : undefined
                  }
                  onChange={(date) => {
                    if (!date) return updateFilter("endDate", undefined);
                    updateFilter("endDate", format(date, "yyyy-MM-dd"));
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale={vi}
                  customInput={<CustomDateInput placeholder="dd/mm/yyyy" />}
                />
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="pt-3 border-t border-gray-200 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-black bg-white rounded flex items-center border border-gray-300 hover:bg-blue-900 hover:text-white hover:shadow-md transition duration-150 cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
