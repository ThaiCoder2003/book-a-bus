"use client";

import { useState } from "react";
import Button from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { X, Plus, Trash2, Clock, MapPin, Navigation } from "lucide-react";

// Import types của bạn (Giả định path)
import type { Route } from "@/types/route.type";
import type { RouteStation } from "@/types/RouteStation.type";

interface CreateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Component con hiển thị từng trạm trong tuyến
interface StopItemProps {
  stop: Partial<
    RouteStation & { name: string; address: string; province: string }
  >;
  idx: number;
  totalStops: number;
  updateStop: (idx: number, field: string, value: any) => void;
  removeStop: (idx: number) => void;
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

  return (
    <div className="p-4 border rounded-lg space-y-3 relative shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
              isStart
                ? "bg-green-600 text-white"
                : isEnd
                ? "bg-red-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            {idx + 1}
          </div>
          <div>
            <p className="font-semibold text-base">
              {isStart
                ? "Điểm khởi hành"
                : isEnd
                ? "Điểm kết thúc"
                : `Trạm dừng số ${idx + 1}`}
            </p>
          </div>
        </div>

        {totalStops > 2 && (
          <button
            type="button"
            onClick={() => removeStop(idx)}
            className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Tên trạm (VD: Bến xe Miền Đông)"
          value={stop.name || ""}
          onChange={(e) => updateStop(idx, "name", e.target.value)}
        />
        <Input
          placeholder="Địa chỉ chi tiết"
          value={stop.address || ""}
          onChange={(e) => updateStop(idx, "address", e.target.value)}
          icon={<MapPin size={16} />}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2">
        {/* Distance From Start */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Khoảng cách từ điểm đầu
          </label>
          <div className="relative">
            <Input
              type="number"
              disabled={isStart}
              placeholder={isStart ? "0" : "Số km"}
              value={isStart ? 0 : stop.distanceFromStart}
              onChange={(e) =>
                updateStop(idx, "distanceFromStart", Number(e.target.value))
              }
              className="pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              km
            </span>
          </div>
        </div>

        {/* Duration From Start */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            TG di chuyển từ điểm đầu
          </label>
          <div className="relative">
            <Input
              type="number"
              disabled={isStart}
              placeholder={isStart ? "0" : "Số phút"}
              value={isStart ? 0 : stop.durationFromStart}
              onChange={(e) =>
                updateStop(idx, "durationFromStart", Number(e.target.value))
              }
              className="pr-10"
            />
            <Clock
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* Price From Start (Optional) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Giá vé từ điểm đầu
          </label>
          <div className="relative">
            <Input
              type="number"
              disabled={isStart}
              placeholder="VNĐ"
              value={isStart ? 0 : stop.priceFromStart}
              onChange={(e) =>
                updateStop(idx, "priceFromStart", Number(e.target.value))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CreateRouteModal({
  isOpen,
  onClose,
}: CreateRouteModalProps) {
  const [routeName, setRouteName] = useState("");

  // State lưu trữ mảng RouteStation mở rộng thêm thông tin Station để hiển thị UI
  const [stops, setStops] = useState<any[]>([
    {
      name: "",
      address: "",
      province: "",
      distanceFromStart: 0,
      durationFromStart: 0,
      priceFromStart: 0,
      order: 1,
    },
    {
      name: "",
      address: "",
      province: "",
      distanceFromStart: 0,
      durationFromStart: 0,
      priceFromStart: 0,
      order: 2,
    },
  ]);

  const addStop = () => {
    setStops([
      ...stops,
      {
        name: "",
        address: "",
        province: "",
        distanceFromStart: 0,
        durationFromStart: 0,
        priceFromStart: 0,
        order: stops.length + 1,
      },
    ]);
  };

  const removeStop = (index: number) => {
    const newStops = stops.filter((_, i) => i !== index);
    setStops(newStops.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const updateStop = (index: number, field: string, value: any) => {
    const newStops = [...stops];
    newStops[index][field] = value;
    setStops(newStops);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format dữ liệu theo đúng Interface Route của bạn trước khi gửi API
    const routeData: Partial<Route> = {
      name: routeName,
      stops: stops.map((s, index) => ({
        order: index + 1,
        distanceFromStart: s.distanceFromStart,
        durationFromStart: s.durationFromStart,
        priceFromStart: s.priceFromStart,
        station: {
          name: s.name,
          address: s.address,
          province: s.province,
        },
      })) as any,
    };

    console.log("Dữ liệu gửi đi:", routeData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col bg-gray-50 rounded-xl">
        {/* Header */}
        <div className="p-6 bg-white border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Thiết lập lộ trình tuyến
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Tên tuyến */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <label className="block text-sm font-semibold mb-2">
              Tên tuyến đường
            </label>
            <Input
              placeholder="Ví dụ: Hà Nội - Sài Gòn (Cao tốc)"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-600 p-4 rounded-lg text-white">
              <p className="text-xs opacity-80">Tổng chiều dài</p>
              <p className="text-2xl font-bold">
                {stops[stops.length - 1]?.distanceFromStart || 0} km
              </p>
            </div>
            <div className="bg-orange-500 p-4 rounded-lg text-white">
              <p className="text-xs opacity-80">Tổng thời gian dự kiến</p>
              <p className="text-2xl font-bold">
                {stops[stops.length - 1]?.durationFromStart || 0} phút
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500">Số trạm dừng</p>
              <p className="text-2xl font-bold text-gray-800">{stops.length}</p>
            </div>
          </div>

          {/* List trạm */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Danh sách các trạm dừng</h3>
              <Button
                type="button"
                onClick={addStop}
                variant="outline"
                className="gap-2 border-blue-600 text-blue-600"
              >
                <Plus size={16} /> Thêm trạm trung gian
              </Button>
            </div>

            {stops.map((stop, idx) => (
              <StopItem
                key={idx}
                stop={stop}
                idx={idx}
                totalStops={stops.length}
                updateStop={updateStop}
                removeStop={removeStop}
              />
            ))}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8"
          >
            Lưu tuyến đường
          </Button>
        </div>
      </Card>
    </div>
  );
}
