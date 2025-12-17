import React, { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import type { Trip, TripStatus } from "../../types/trip";
import { mockRoutes } from "../../types/route";
import { mockTrips } from "../../data/tripMock";
import { mockFleet } from "../../data/fleetMock"; // ✅ Thêm dòng này để lấy dữ liệu đội xe

interface TripFormModalProps {
  open: boolean;
  onClose: () => void;
  tripToEdit: Trip | null;
  onSubmit: (tripData: Trip) => void;
}

const statusOptions: { value: TripStatus; label: string }[] = [
  { value: "scheduled", label: "Sắp Khởi Hành" },
  { value: "on_going", label: "Đang Diễn Ra" },
  { value: "completed", label: "Hoàn Thành" },
  { value: "canceled", label: "Đã Hủy" },
];

const initialFormState: Omit<Trip, "id"> = {
  routeId: "",
  routeName: "",
  departureDate: "",
  departureTime: "",
  busCompanyName: "",
  busPlate: "",
  driverName: "",
  status: "scheduled",
  price: 0,
};

const generateTripId = (trips: Trip[]) => {
  if (!Array.isArray(trips) || trips.length === 0) {
    return "T00001";
  }

  const numericIds = trips
    .map((trip) => {
      const cleanId =
        typeof trip.id === "string" ? trip.id.replace(/\D/g, "") : "";
      const num = parseInt(cleanId, 10);
      return isNaN(num) ? 0 : num;
    })
    .filter((n) => n > 0);

  const maxIdNum = numericIds.length > 0 ? Math.max(...numericIds) : 0;
  const newIdNum = maxIdNum + 1;

  return `T${newIdNum.toString().padStart(5, "0")}`;
};

export function TripFormModal({
  open,
  onClose,
  tripToEdit,
  onSubmit,
}: TripFormModalProps) {
  const [formData, setFormData] = useState<Omit<Trip, "id">>(initialFormState);

  // ✅ Đồng bộ dữ liệu khi mở modal
  useEffect(() => {
    if (!open) return;
    Promise.resolve().then(() => {
      if (tripToEdit) {
        const { ...rest } = tripToEdit;
        setFormData(rest);
      } else {
        setFormData(initialFormState);
      }
    });
  }, [tripToEdit, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTripData = tripToEdit
      ? { ...formData, id: tripToEdit.id }
      : { ...formData, id: generateTripId(mockTrips) };
    onSubmit(finalTripData as Trip);
  };

  if (!open) return null;

  const title = tripToEdit ? "Chỉnh Sửa Chuyến Đi" : "Thêm Chuyến Đi Mới";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 shadow-sm transition-all">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-md transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-sm">
          {/* Row 1: ID + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">
                ID Chuyến (Tự động)
              </label>
              <input
                type="text"
                value={tripToEdit ? tripToEdit.id : ""}
                readOnly
                placeholder="Tự động tạo"
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={!tripToEdit}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  !tripToEdit
                    ? "bg-gray-100 cursor-not-allowed text-gray-500"
                    : ""
                }`}
                required
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              {!tripToEdit && (
                <p className="text-xs text-gray-500 mt-1">
                  Trạng thái mặc định là <strong>Sắp khởi hành</strong>.
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Tuyến đường + Giá vé */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Tuyến đường</label>
              <select
                name="routeId"
                value={formData.routeId}
                onChange={(e) => {
                  const selected = mockRoutes.find(
                    (r) => r.id.toString() === e.target.value,
                  );
                  const fullRouteName = selected
                    ? `${selected.from} - ${selected.to}`
                    : "";
                  setFormData((prev) => ({
                    ...prev,
                    routeId: e.target.value,
                    routeName: fullRouteName,
                    departurePoint: selected?.from || "",
                    arrivalPoint: selected?.to || "",
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn tuyến đường</option>
                {mockRoutes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.from} → {r.to})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Giá vé (₫)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ví dụ: 550000"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Row 3: Ngày & Giờ */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Ngày khởi hành</label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Giờ khởi hành</label>
              <input
                type="time"
                name="departureTime"
                value={formData.departureTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* ✅ Row 4: Chọn xe trong đội xe */}
          <div className="grid grid-cols-2 gap-4">
            {/* Biển số xe */}
            <div>
              <label className="block text-gray-600 mb-1">Biển số xe</label>
              <select
                name="busPlate"
                value={formData.busPlate}
                onChange={(e) => {
                  const selectedPlate = e.target.value;
                  const selectedVehicle = mockFleet.find(
                    (v) => v.licensePlate === selectedPlate,
                  );
                  setFormData((prev) => ({
                    ...prev,
                    busPlate: selectedPlate,
                    busCompanyName: selectedVehicle?.name || "",
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Chọn xe theo biển số</option>
                {mockFleet.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.licensePlate}>
                    {vehicle.licensePlate} — {vehicle.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nhà xe / Tên xe */}
            <div>
              <label className="block text-gray-600 mb-1">
                Nhà xe / Tên xe
              </label>
              <input
                type="text"
                name="busCompanyName"
                value={formData.busCompanyName}
                readOnly
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          {/* Row 5: Tài xế */}
          <div>
            <label className="block text-gray-600 mb-1">Tài xế</label>
            <input
              type="text"
              name="driverName"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Row 6: Điểm khởi hành & Điểm đến */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-1">Điểm khởi hành</label>
              <input
                type="text"
                name="departurePoint"
                value={formData.departurePoint || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Bến xe Giáp Bát"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Điểm đến</label>
              <input
                type="text"
                name="arrivalPoint"
                value={formData.arrivalPoint || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Bến xe Trung Tâm Đà Nẵng"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-800">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed">
              <strong>Cảnh báo:</strong> Kiểm tra xung đột lịch xe. Nếu xe đã
              được gán cho chuyến khác cùng thời gian, hệ thống sẽ cảnh báo.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {tripToEdit ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
