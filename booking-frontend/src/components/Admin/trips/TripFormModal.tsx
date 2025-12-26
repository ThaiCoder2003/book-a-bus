// components/Admin/trips/TripFormModal.tsx
"use client";

import { useEffect, useState } from "react";
import type { Trip } from "@/types/trip.type";
import type { Route } from "@/types/route.type";
import type { Bus } from "@/types/bus.type";

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
    departureTime: "",
  });

  // Sync state với tripToEdit khi modal mở
  useEffect(() => {
    setTimeout(() => {
      if (tripToEdit) {
        setForm({
          routeId: tripToEdit.routeId ?? "",
          busId: tripToEdit.busId ?? "",
          departureTime: tripToEdit.departureTime
            ? tripToEdit.departureTime.slice(0, 16)
            : "",
        });
      } else {
        setForm({ routeId: "", busId: "", departureTime: "" });
      }
    }, 0);
  }, [tripToEdit, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.routeId || !form.busId || !form.departureTime) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const trip: Trip = {
      id:
        tripToEdit?.id ??
        (typeof crypto !== "undefined"
          ? crypto.randomUUID()
          : Math.random().toString(36)),
      routeId: form.routeId,
      busId: form.busId,
      departureTime: new Date(form.departureTime).toISOString(),
    };

    onSubmit(trip);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
              value={form.departureTime.split("T")[0]}
              onChange={(e) =>
                setForm({
                  ...form,
                  departureTime: `${e.target.value}T${
                    form.departureTime.split("T")[1] || "00:00"
                  }`,
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
              value={form.departureTime.split("T")[1]?.slice(0, 5)}
              onChange={(e) =>
                setForm({
                  ...form,
                  departureTime: `${form.departureTime.split("T")[0]}T${
                    e.target.value
                  }`,
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
