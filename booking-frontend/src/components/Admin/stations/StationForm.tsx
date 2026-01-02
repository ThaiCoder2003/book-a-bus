import React from "react";
import { X } from "lucide-react";
import type { Station } from "@/types/station.type";

interface Props {
  mode: "create" | "edit";
  initialData?: Station | null;
  onSubmit: (data: Omit<Station, "id">) => void;
  onCancel: () => void;
  isLoading?: boolean
}

export const StationForm = ({
  mode,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}: Props) => {
  const [name, setName] = React.useState(initialData?.name ?? "");
  const [address, setAddress] = React.useState(initialData?.address ?? "");
  const [province, setProvince] = React.useState(initialData?.province ?? "");

  return (
    // Cố định w-380 h-380, bo góc lớn và đổ bóng mịn
    <div className="w-[380px] h-[380px]  bg-white rounded-4x1 flex flex-col justify-between font-sans border rounded-xl p-6 shadow-lg">
      {/* Header: Thu nhỏ margin-bottom */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[19px] font-bold tracking-tight text-black leading-tight">
            {mode === "create" ? "Tạo điểm dừng" : "Sửa điểm dừng"}
          </h3>
          <p className="text-[14px] text-gray-400">
            {mode === "create" ? "Thêm mới" : "Cập nhật thông tin"}
          </p>
        </div>
        <button
          disabled={isLoading}
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" strokeWidth={2} />
        </button>
      </div>

      {/* Form body: Dùng space-y-3 để vừa khít 380px */}
      <div className="space-y-3">
        <div>
          <label className="block text-[14px] font-semibold mb-1 text-black">
            Tên điểm dừng
          </label>
          <input
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
            placeholder="Bến xe Hà Nội"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[14px] font-semibold mb-1 text-black">
            Địa chỉ
          </label>
          <input
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
            placeholder="123 Đường Lê Duẩn, Quận Hoàn Kiếm"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[14px] font-semibold mb-1 text-black">
            Tỉnh/Thành phố
          </label>
          <input
            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-[14px] focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
            placeholder="Hà Nội"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>
      </div>

      {/* Action buttons: Đẩy sát xuống dưới */}
      <div className="flex gap-2.5 mt-2">
        <button
          disabled={isLoading}
          className="flex-1 bg-[#121212] text-white rounded-xl py-3 text-[15px] font-bold hover:bg-black transition-colors"
          onClick={() => onSubmit({ name, address, province })}
        >
          {mode === "create" ? "Tạo" : "Cập nhật"}
        </button>
        <button
          disabled={isLoading}
          className="px-5 py-3 rounded-xl border border-gray-200 text-[15px] font-semibold hover:bg-gray-50 transition-colors"
          onClick={onCancel}
        >
          Hủy
        </button>
      </div>
    </div>
  );
};
