// components/Admin/trips/TripFormModal.tsx
"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/types/trip.type";
import type { Route } from "@/types/route.type";
import type { Bus } from "@/types/bus.type";
import { toast } from "react-toastify";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (trip: Trip) => void;
  tripToEdit: Trip | null;
  routes: Route[];
  buses: Bus[];
}

export function TripFormModal({
  open,
  onClose,
  onSubmit,
  tripToEdit,
  routes,
  buses,
}: Props) {
  const [form, setForm] = useState({
    routeId: "",
    busId: "",
    departureDate: "", // Tách riêng để dễ quản lý
    departureTime: "", // Tách riêng để dễ quản lý
  });

useEffect(() => {
  if (open && tripToEdit) {
    const d = new Date(tripToEdit.departureTime);
    
    // Ép về format YYYY-MM-DD
    const dateForInput = d.toLocaleDateString('en-CA'); // 'en-CA' luôn trả về YYYY-MM-DD
    
    // Ép về format HH:mm
    const timeForInput = d.toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    setForm({
      routeId: tripToEdit.routeId || "",
      busId: tripToEdit.busId || "",
      departureDate: dateForInput, 
      departureTime: timeForInput,
    });
  }
}, [tripToEdit, open]);
  if (!open) return null;

  const handleSubmit = () => {
    // 1. Kiểm tra đủ field (Dùng form.departureDate và form.departureTime riêng)
    if (!form.routeId || !form.busId || !form.departureTime || !form.departureDate) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // 2. Ghép Date và Time thành một đối tượng Date duy nhất
    // Ví dụ: "2023-11-20" + "T" + "08:00"
    const combinedISO = new Date(`${form.departureDate}T${form.departureTime}`).toISOString();

    // 3. Tạo Object gửi đi
    const tripPayload: any = {
      routeId: form.routeId,
      busId: form.busId,
      departureTime: combinedISO,
    };

    // Nếu là Edit thì mới đính kèm ID, Create thì để Backend tự sinh ID
    if (tripToEdit?.id) {
      tripPayload.id = tripToEdit.id;
    }

    onSubmit(tripPayload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {tripToEdit ? "Cập nhật chuyến đi" : "Thêm Chuyến Đi Mới"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* ID (Read only) */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              ID Chuyến (Tự động)
            </label>
            <input
              disabled
              placeholder="Tự động tạo"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>

          {/* Trạng thái */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              Trạng thái
            </label>
            <select className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sắp Khởi Hành</option>
            </select>
          </div>

          {/* Tuyến đường */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              Tuyến đường
            </label>
            <select
              value={form.routeId}
              onChange={(e) => setForm({ ...form, routeId: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn tuyến đường</option>
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày khởi hành */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              Ngày khởi hành
            </label>
            <input
              type="date"
              value={form.departureDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  departureDate: e.target.value
                })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none"
            />
          </div>

          {/* Giờ khởi hành */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-600">
              Giờ khởi hành
            </label>
            <input
              type="time"
              value={form.departureTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  departureTime: e.target.value,
                })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none"
            />
          </div>

          {/* Biển số xe */}
          <div className="space-y-1 md:col-span-1">
            <label className="text-sm font-semibold text-slate-600">
              Biển số xe
            </label>
            <select
              value={form.busId}
              onChange={(e) => setForm({ ...form, busId: e.target.value })}
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none"
            >
              <option value="">Chọn xe</option>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.plateNumber} ({b.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Warning Box */}
        <div className="mx-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 items-start text-amber-700 text-sm">
          <span className="font-bold">⚠️ Cảnh báo:</span>
          <span>
            Kiểm tra xung đột lịch xe. Nếu xe đã được gán cho chuyến khác cùng
            thời gian, hệ thống sẽ cảnh báo.
          </span>
        </div>

        {/* Actions */}
        <div className="p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            {tripToEdit ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
