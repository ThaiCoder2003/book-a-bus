import React, { useState } from "react";
import { X } from "lucide-react";
import type { Vehicle } from "../../types/fleet";

interface VehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vehicle: Vehicle) => void;
  editingVehicle?: Vehicle | null;
}

const initialVehicleState: Vehicle = {
  id: "",
  name: "",
  licensePlate: "",
  type: "",
  status: "Active",
  capacity: 24,
  amenities: ["WiFi", "Cổng USB"],
  seatLayout: [],
};

const VehicleModal: React.FC<VehicleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingVehicle,
}) => {
  // 👉 Không cần useEffect — khởi tạo trực tiếp từ editingVehicle
  const [vehicleData, setVehicleData] = useState<Vehicle>(
    editingVehicle ?? initialVehicleState,
  );
  React.useEffect(() => {
    if (editingVehicle) {
      setVehicleData(editingVehicle);
    } else {
      setVehicleData(initialVehicleState);
    }
  }, [editingVehicle, isOpen]);
  // 👉 Nếu modal bị đóng thì không render
  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const target = e.target;
    const { name, value, type } = target;

    // ✅ Ép kiểu rõ ràng khi dùng checked
    if (type === "checkbox" && name.startsWith("amenity-")) {
      const input = target as HTMLInputElement;
      const amenity = name.replace("amenity-", "");

      setVehicleData((prev) => {
        const newAmenities = input.checked
          ? [...prev.amenities, amenity]
          : prev.amenities.filter((a) => a !== amenity);
        return { ...prev, amenities: newAmenities };
      });
    } else if (type === "radio") {
      const input = target as HTMLInputElement;
      setVehicleData((prev) => ({ ...prev, [name]: input.value }));
    } else {
      setVehicleData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseInt(value, 10) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalVehicle: Vehicle = {
      ...vehicleData,
      id: vehicleData.id || crypto.randomUUID(),
    };

    onSubmit(finalVehicle);
    onClose();
  };

  const availableAmenities = ["WiFi", "Cổng USB", "Điều hòa", "Nhà vệ sinh"];
  const vehicleTypes = [
    "Xe Limousine 01",
    "Xe Giường Nằm 02",
    "Xe Ghế Ngồi 03",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 animate-fadeIn">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {editingVehicle ? "Chỉnh sửa xe" : "Thêm xe mới"}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <p className="text-sm text-gray-500">
            Nhập thông tin chi tiết về xe vào đội xe của bạn.
          </p>

          {/* --- Thông tin cơ bản --- */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tên xe */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tên xe *
              </label>
              <input
                type="text"
                name="name"
                value={vehicleData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Biển số */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Biển số *
              </label>
              <input
                type="text"
                name="licensePlate"
                value={vehicleData.licensePlate}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Loại xe */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Loại xe *
              </label>
              <select
                name="type"
                value={vehicleData.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn loại xe --</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Số ghế */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Số ghế *
              </label>
              <input
                type="number"
                name="capacity"
                value={vehicleData.capacity}
                onChange={handleChange}
                min={1}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* --- Trạng thái --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái *
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Active"
                  checked={vehicleData.status === "Active"}
                  onChange={handleChange}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Hoạt động</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Maintenance"
                  checked={vehicleData.status === "Maintenance"}
                  onChange={handleChange}
                  className="text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-2 text-sm text-gray-700">Đang bảo trì</span>
              </label>
            </div>
          </div>

          {/* --- Tiện nghi --- */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiện nghi
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    name={`amenity-${amenity}`}
                    checked={vehicleData.amenities.includes(amenity)}
                    onChange={handleChange}
                    className="text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* --- Nút hành động --- */}
          <div className="pt-4 flex justify-end space-x-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              {editingVehicle ? "Lưu thay đổi" : "Thêm xe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;
