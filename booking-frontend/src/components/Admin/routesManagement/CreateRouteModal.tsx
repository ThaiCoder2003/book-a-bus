"use client";

import { useState } from "react";
// Giả định các components UI này đã được định nghĩa
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
// Import các icons cần thiết
import { X, Plus, Trash2, Clock, MapPin } from "lucide-react";
// Giả định kiểu Stop
interface Stop {
  id: string;
  name: string;
  address: string;
  arrivalTime: string;
  departureTime: string;
  type: "start" | "stop" | "end";
}
// Dùng type cho props
interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cities = [
  "Hà Nội",
  "TP Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Huế",
  "Quy Nhơn",
];

// Component cho việc hiển thị Điểm dừng (KHÔNG THAY ĐỔI)
interface StopItemProps {
  stop: Stop;
  idx: number;
  totalStops: number;
  updateStop: (id: string, field: keyof Stop, value: string) => void;
  removeStop: (id: string) => void;
}

const StopItem: React.FC<StopItemProps> = ({
  stop,
  idx,
  totalStops,
  updateStop,
  removeStop,
}) => {
  const isStart = idx === 0;
  const isEnd = idx === totalStops - 1;
  const isRemovable = totalStops > 1;

  const title = isStart
    ? "Điểm khởi hành"
    : isEnd
    ? "Điểm kết thúc"
    : "Điểm trung gian";
  const subtitle = isStart
    ? "Nơi xe bắt đầu chạy"
    : isEnd
    ? "Điểm dừng cuối"
    : "Điểm dừng giữa";

  // Đổi tên placeholder để rõ ràng hơn
  const namePlaceholder = isStart
    ? "Tên điểm (ví dụ: Bến xe Mỹ Đình)"
    : isEnd
    ? "Tên điểm (ví dụ: Bến xe Miền Đông)"
    : "Tên điểm dừng";

  const addressPlaceholder = "Địa chỉ (ví dụ: Tây Sơn, Đống Đa, Hà Nội)";

  return (
    <div className="p-4 border rounded-lg space-y-3 relative shadow-sm">
      <div className="flex justify-between items-start">
        {/* Biểu tượng số thứ tự/loại điểm dừng */}
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
              isStart
                ? "bg-blue-600 text-white"
                : isEnd
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {idx + 1}
          </div>
          <div>
            <p className="font-semibold text-base">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Nút xóa */}
        {isRemovable && (
          <button
            type="button"
            onClick={() => removeStop(stop.id)}
            className="p-2 ml-4 hover:bg-red-50 text-red-600 rounded transition-colors cursor-pointer"
            aria-label="Xóa điểm dừng"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Trường Tên điểm dừng */}
      <Input
        placeholder={namePlaceholder}
        value={stop.name}
        onChange={(e) => updateStop(stop.id, "name", e.target.value)}
      />

      {/* Trường Địa chỉ */}
      <Input
        placeholder={addressPlaceholder}
        value={stop.address}
        onChange={(e) => updateStop(stop.id, "address", e.target.value)}
        icon={<MapPin size={18} className="text-muted-foreground " />}
      />

      {/* Thời gian */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {/* Giờ Đến Dự Kiến */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {isEnd ? "Giờ Đến Dự Kiến" : "Giờ Đến"}
          </label>
          <div className="relative">
            <Input
              type="time"
              value={stop.arrivalTime}
              onChange={(e) =>
                updateStop(stop.id, "arrivalTime", e.target.value)
              }
              className="pr-10" // Tạo khoảng trống cho icon
            />
            <Clock
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none "
            />
          </div>
        </div>

        {/* Giờ Đi Dự Kiến */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            {isStart ? "Giờ Khởi Hành" : "Giờ Đi Dự Kiến"}
          </label>
          <div className="relative">
            <Input
              type="time"
              value={stop.departureTime}
              onChange={(e) =>
                updateStop(stop.id, "departureTime", e.target.value)
              }
              className="pr-10" // Tạo khoảng trống cho icon
            />
            <Clock
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component chính
export default function CreateRouteModal({
  isOpen,
  onClose,
}: CreateRouteModalProps) {
  const [routeName, setRouteName] = useState("");
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");

  // 1. KHỞI TẠO VỚI 2 ĐIỂM DỪNG (Khởi hành và Kết thúc)
  const [stops, setStops] = useState<Stop[]>([
    {
      id: "1",
      name: "",
      address: "",
      arrivalTime: "",
      departureTime: "",
      type: "start",
    },
    {
      id: "2",
      name: "",
      address: "",
      arrivalTime: "",
      departureTime: "",
      type: "end", // Mặc định là điểm cuối
    },
  ]);

  const updateStopTypes = (newStops: Stop[]): Stop[] => {
    if (newStops.length === 1) {
      return [{ ...newStops[0], type: "start" as const }];
    }

    return newStops.map((s, idx) => ({
      ...s,
      type:
        idx === 0
          ? ("start" as const)
          : idx === newStops.length - 1
          ? ("end" as const)
          : ("stop" as const),
    }));
  };

  // 2. SỬA HÀM addStop: THÊM VÀO VỊ TRÍ TRƯỚC ĐIỂM CUỐI
  const addStop = () => {
    const newStop: Stop = {
      id: crypto.randomUUID(),
      name: "",
      address: "",
      arrivalTime: "",
      departureTime: "",
      type: "stop" as const, // Mặc định là stop, sau đó updateStopTypes sẽ sửa
    };

    // Tạo mảng mới: [Điểm bắt đầu, ...điểm trung gian cũ, ĐIỂM MỚI, Điểm kết thúc]
    const stopsExceptEnd = stops.slice(0, stops.length - 1);
    const endStop = stops[stops.length - 1];

    const newStops = [...stopsExceptEnd, newStop, endStop];

    setStops(updateStopTypes(newStops));
  };

  // Các hàm còn lại không thay đổi
  const removeStop = (id: string) => {
    const newStops = stops.filter((s) => s.id !== id);
    setStops(updateStopTypes(newStops));
  };

  const updateStop = (id: string, field: keyof Stop, value: string) => {
    setStops(
      stops.map((stop) =>
        stop.id === id ? { ...stop, [field]: value } : stop,
      ),
    );
  };

  const calculateDuration = () => {
    if (stops.length < 2) return "0h 0m";

    const start = stops[0].departureTime;
    const end = stops[stops.length - 1].arrivalTime;

    if (!start || !end) return "0h 0m";

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    let diff = eh * 60 + em - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;

    return `${Math.floor(diff / 60)}h ${diff % 60}m`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      routeName,
      startCity,
      endCity,
      stops,
      duration: calculateDuration(),
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl rounded-xl hide-scrollbar">
        <div className=" top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            Tạo tuyến đường mới
          </h2>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Đóng"
          >
            <X className="cursor-pointer" size={24} />
          </button>
        </div>
        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* BASIC INFO */}
          <div className="space-y-4">
            <Input
              placeholder="Tên tuyến (VD: HN - SG)"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="h-12 text-base border-gray-300" // Làm Input lớn hơn
            />

            <div className="grid grid-cols-2 gap-4">
              {/* SELECT CITIES */}
              <select
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              >
                <option value="" disabled>
                  Thành phố khởi hành
                </option>

                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                value={endCity}
                onChange={(e) => setEndCity(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              >
                <option value="" disabled>
                  Thành phố đến
                </option>

                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* STATS - Đã thay đổi màu nền để giống ảnh mẫu hơn */}

          <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div>
              <p className="text-sm font-medium text-blue-700">Số điểm dừng</p>

              <p className="text-3xl font-extrabold text-gray-900 mt-1">
                {stops.length}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-blue-700">
                Thời gian dự kiến
              </p>

              <p className="text-3xl font-extrabold text-red-600 mt-1">
                {calculateDuration()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-blue-700">Trạng thái</p>

              <Badge className="mt-1 bg-blue-200 text-blue-800 font-semibold text-sm py-1 px-3">
                Nháp
              </Badge>
            </div>
          </div>
          {/* STOPS */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-900">Điểm Dừng</h3>

              <Button
                type="button"
                variant="outline"
                onClick={addStop}
                className="gap-2 border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Plus size={16} /> Thêm điểm dừng
              </Button>
            </div>
            {/* Render StopItem component */}
            {stops.map((stop, idx) => (
              <StopItem
                key={stop.id}
                stop={stop}
                idx={idx}
                totalStops={stops.length}
                updateStop={updateStop}
                removeStop={removeStop}
              />
            ))}
          </div>
          {/* ACTIONS - Nút chính màu xanh đậm */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 cursor-pointer"
            >
              Hủy
            </Button>
            {/* Đổi màu nút Submit thành màu xanh đậm để nổi bật */}

            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md transition-colors cursor-pointer"
            >
              Xác nhận tạo tuyến
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
