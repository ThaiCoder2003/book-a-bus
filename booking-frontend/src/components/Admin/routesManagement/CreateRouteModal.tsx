"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { Station } from "@/types/station.type";
import type { RouteStationForm } from "@/types/routeStationForm.type";
import routeService from "@/services/routeService";
import { toast } from "react-toastify";


export default function CreateRouteModal({
  isOpen,
  onClose,
  stations, // Nhận prop stations từ cha
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  stations: Station[];
  onSuccess?: () => void;
}) {
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
        stationId: "",
        order: stops.length + 1,
        distanceFromStart: 0,
        durationFromStart: 0,
        priceFromStart: 0,
      },
    ]);
  };

  const removeStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const updateStop = <K extends keyof RouteStationForm>(
    index: number,
    field: K,
    value: RouteStationForm[K],
  ) => {
    setStops((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value,
        order: index + 1,
      };
      return next;
    });
  };

  // Tính toán số liệu thống kê
  const totalDistance = stops.reduce(
    (sum, s) => sum + Number(s.distanceFromStart || 0),
    0,
  );
  const totalDuration = stops.reduce(
    (sum, s) => sum + Number(s.durationFromStart || 0),
    0,
  );

  if (!isOpen) return null;

  const handleCloseAndReset = () => {
    setRouteName("");
    setStops([
      { stationId: "", order: 1, distanceFromStart: 0, durationFromStart: 0, priceFromStart: 0 },
      { stationId: "", order: 2, distanceFromStart: 0, durationFromStart: 0, priceFromStart: 0 },
    ]);
    onClose();
  };

  const handleSubmit = async () => {
    if (!routeName.trim()) return toast.error("Vui lòng nhập tên tuyến!")
    if (stops.length < 2) return toast.error("Tuyến đường phải có ít nhất 2 trạm");
    if (stops.some(s => !s.stationId)) return toast.error("Vui lòng chọn đầy đủ trạm dừng");

    try {
      const payload = {
        name: routeName,
        // Chuyển đổi dữ liệu để chắc chắn là Number (tránh lỗi string từ input)
        stops: stops.map((s, index) => ({
          stationId: s.stationId,
          order: index + 1,
          distanceFromStart: Number(s.distanceFromStart || 0),
          durationFromStart: Number(s.durationFromStart || 0),
          priceFromStart: Number(s.priceFromStart || 0),
        })),
      };

      await routeService.create(payload)

      toast.success("Tạo tuyến đường thành công!");
      if (onSuccess) onSuccess(); 
      
      handleCloseAndReset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo tuyến đường");
    }
  }



  return (
    <div className="fixed inset-0 rounded-3x1 bg-black/50 flex items-center justify-center z-50 p-4 ">
      <div className="bg-white w-full max-w-[500px] rounded-3x1 shadow-2xl flex flex-col font-sans overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-2 flex justify-between items-center">
          <h2 className="text-[22px] font-bold text-[#111827]">
            Tạo Tuyến Mới
          </h2>
          <button
            onClick={handleCloseAndReset}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-2 space-y-6 max-h-[75vh] custom-scrollbar">
          {/* Tên tuyến đường */}
          <div className="space-y-2">
            <label className="text-[15px] font-semibold text-gray-700">
              Tên Tuyến Đường
            </label>
            <input
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-[15px] focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-400"
              placeholder="VD: Hà Nội - Sài Gòn"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
            />
          </div>

          {/* Panel Thống kê - Giống ảnh 100% */}
          <div className="grid grid-cols-3 gap-1 bg-gray-50/80 p-4 rounded-[20px] border border-gray-100">
            <div className="text-center">
              <p className="text-[11px] font-medium text-gray-500 mb-1 leading-tight">
                Tổng Quãng Đường
              </p>
              <p className="text-[18px] font-bold text-blue-600">
                {totalDistance} km
              </p>
            </div>
            <div className="text-center border-x border-gray-200">
              <p className="text-[11px] font-medium text-gray-500 mb-1 leading-tight">
                Tổng Thời Gian
              </p>
              <p className="text-[18px] font-bold text-orange-600">
                {totalDuration} phút
              </p>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-medium text-gray-500 mb-1 leading-tight">
                Số Trạm
              </p>
              <p className="text-[18px] font-bold text-green-600">
                {stops.length}
              </p>
            </div>
          </div>

          {/* Danh sách trạm */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-[16px] text-gray-800">
                Danh Sách Trạm Dừng
              </h3>
              <button
                onClick={addStop}
                className="flex items-center gap-1 text-blue-600 font-bold text-[14px] hover:opacity-80"
              >
                <Plus size={16} strokeWidth={3} /> Thêm Trạm
              </button>
            </div>

            {stops.length === 0 ? (
              /* Empty State (Ảnh 2) */
              <div className="border-2 border-dashed border-gray-200 rounded-2xl py-14 flex flex-col items-center justify-center bg-gray-50/50">
                <p className="text-gray-500 text-[15px] mb-2">
                  Chưa có trạm dừng
                </p>
                <button
                  onClick={addStop}
                  className="text-blue-600 text-[15px] font-bold"
                >
                  Thêm trạm đầu tiên
                </button>
              </div>
            ) : (
              /* Item List (Ảnh 1) */
              <div className="space-y-4 pb-4">
                {stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="p-5 border border-gray-100 rounded-[20px] bg-white shadow-sm space-y-4 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[16px] font-bold text-gray-800">
                        Trạm {idx + 1}
                      </span>
                      <button
                        onClick={() => removeStop(idx)}
                        className="text-red-500 p-1 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-gray-600">
                        Chọn Trạm Dừng
                      </label>
                      <select
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] outline-none appearance-none cursor-pointer focus:border-blue-500"
                        value={stop.stationId}
                        onChange={(e) =>
                          updateStop(idx, "stationId", e.target.value)
                        }
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1em",
                        }}
                      >
                        <option value="">-- Chọn trạm --</option>
                        {stations
                            .filter((s) => 
                              // Chỉ giữ lại trạm nếu nó chưa được chọn ở bất kỳ ô nào khác (trừ chính ô hiện tại)
                              !stops.some((otherStop, otherIdx) => otherStop.stationId === s.id && otherIdx !== idx)
                            )
                            .map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.province})
                              </option>
                            ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 uppercase leading-tight">
                          Quãng Đường (km)
                        </label>
                        <input
                          type="number"
                          disabled={idx === 0}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-blue-500"
                          value={stop.distanceFromStart}
                          onChange={(e) =>
                            updateStop(
                              idx,
                              "distanceFromStart",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 uppercase leading-tight">
                          Thời Gian (phút)
                        </label>
                        <input
                          type="number"
                          disabled={idx === 0}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-blue-500"
                          value={stop.durationFromStart}
                          onChange={(e) =>
                            updateStop(
                              idx,
                              "durationFromStart",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-400 uppercase leading-tight">
                          Giá Khởi đầu (đ)
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-[15px] outline-none focus:border-blue-500"
                          value={stop.priceFromStart}
                          onChange={(e) =>
                            updateStop(
                              idx,
                              "priceFromStart",
                              Number(e.target.value),
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white flex gap-3 border-t border-gray-50">
          <button className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-[15px] transition-all shadow-lg shadow-blue-100"
          onClick={handleSubmit}>
            Lưu Tuyến Đường
          </button>
          <button
            onClick={handleCloseAndReset}
            className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl text-[15px] hover:bg-gray-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
