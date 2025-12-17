import React, { useState, forwardRef } from "react";
import { ChevronUp, ChevronDown, Calendar } from "lucide-react";
import InputMask from "react-input-mask";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

/* ============================
   CUSTOM DATE INPUT
============================ */

const CustomDateInput = forwardRef(
  ({ value, onClick, placeholder }: any, ref: any) => (
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

/* ============================
   FILTER BUTTON
============================ */

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

/* ============================
   MAIN COMPONENT
============================ */

interface FilterSectionProps {
  onFilterChange?: (filters: {
    status: string;
    payment: string;
    route: string;
    startDate?: string; // ISO format (yyyy-MM-dd)
    endDate?: string; // ISO format (yyyy-MM-dd)
    vipOnly: boolean;
  }) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const [filters, setFilters] = useState({
    status: "Tất cả",
    payment: "Tất cả",
    route: "Tất cả",
    startDate: "",
    endDate: "",
    vipOnly: false,
  });

  const [displayDates, setDisplayDates] = useState({
    startDisplay: "",
    endDisplay: "",
  });

  const statusOptions = ["Tất cả", "Đã xác nhận", "Đang chờ", "Đã hủy"];
  const paymentOptions = [
    "Tất cả",
    "Đã thanh toán",
    "Chưa thanh toán",
    "Đã hoàn tiền",
  ];
  const routeOptions = [
    "Tất cả",
    "Hà Nội - TPHCM",
    "Hà Nội - Hải Phòng",
    "TPHCM - Cần Thơ",
  ];

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      status: "Tất cả",
      payment: "Tất cả",
      route: "Tất cả",
      startDate: "",
      endDate: "",
      vipOnly: false,
    };
    setFilters(defaultFilters);
    setDisplayDates({ startDisplay: "", endDisplay: "" });
    onFilterChange?.(defaultFilters);
  };

  return (
    <div className="bg-white border-b border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
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
          <div className="space-y-5">
            {/* Trạng thái đặt vé */}
            <div>
              <p className="text-sm font-medium mb-2 text-gray-700">
                Trạng thái đặt vé
              </p>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    active={filters.status === option}
                    onClick={() => updateFilter("status", option)}
                  />
                ))}
              </div>
            </div>

            {/* Trạng thái thanh toán */}
            <div>
              <p className="text-sm font-medium mb-2 text-gray-700">
                Trạng thái thanh toán
              </p>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    active={filters.payment === option}
                    onClick={() => updateFilter("payment", option)}
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
                {routeOptions.map((option) => (
                  <FilterButton
                    key={option}
                    label={option}
                    active={filters.route === option}
                    onClick={() => updateFilter("route", option)}
                  />
                ))}
              </div>
            </div>

            {/* Khoảng ngày */}
            <div>
              <p className="text-sm font-medium mb-2 text-gray-700">
                Khoảng ngày
              </p>

              <div className="flex w-full gap-3">
                {/* Ngày bắt đầu */}
                <div className="w-1/2">
                  <ReactDatePicker
                    wrapperClassName="w-full"
                    popperClassName="z-50"
                    popperPlacement="bottom-start"
                    selected={
                      displayDates.startDisplay
                        ? new Date(
                            displayDates.startDisplay
                              .split("/")
                              .reverse()
                              .join("-"),
                          )
                        : null
                    }
                    onChange={(date) => {
                      if (!date) {
                        updateFilter("startDate", "");
                        setDisplayDates((p) => ({ ...p, startDisplay: "" }));
                        return;
                      }
                      const display = format(date, "dd/MM/yyyy");
                      const iso = format(date, "yyyy-MM-dd");
                      updateFilter("startDate", iso);
                      setDisplayDates((p) => ({ ...p, startDisplay: display }));
                    }}
                    dateFormat="dd/MM/yyyy"
                    locale={vi}
                    customInput={<CustomDateInput placeholder="dd/mm/yyyy" />}
                  />
                </div>

                {/* Ngày kết thúc */}
                <div className="w-1/2">
                  <ReactDatePicker
                    wrapperClassName="w-full"
                    popperClassName="z-50"
                    popperPlacement="bottom-start"
                    selected={
                      displayDates.endDisplay
                        ? new Date(
                            displayDates.endDisplay
                              .split("/")
                              .reverse()
                              .join("-"),
                          )
                        : null
                    }
                    onChange={(date) => {
                      if (!date) {
                        updateFilter("endDate", "");
                        setDisplayDates((p) => ({ ...p, endDisplay: "" }));
                        return;
                      }
                      const display = format(date, "dd/MM/yyyy");
                      const iso = format(date, "yyyy-MM-dd");
                      updateFilter("endDate", iso);
                      setDisplayDates((p) => ({ ...p, endDisplay: display }));
                    }}
                    dateFormat="dd/MM/yyyy"
                    locale={vi}
                    customInput={<CustomDateInput placeholder="dd/mm/yyyy" />}
                  />
                </div>
              </div>
            </div>

            {/* Vãng lai */}
            <div className="flex items-center pt-2">
              <input
                id="vip"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={filters.vipOnly}
                onChange={(e) => updateFilter("vipOnly", e.target.checked)}
              />
              <label
                htmlFor="vip"
                className="ml-2 text-sm text-gray-600 cursor-pointer"
              >
                Chỉ hiển thị đơn khách hàng vãng lai
              </label>
            </div>

            {/* Nút xóa */}
            <div className="pt-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-black bg-white rounded flex items-center border border-gray-300 hover:bg-blue-900 hover:text-white hover:shadow-md transition duration-150 cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
