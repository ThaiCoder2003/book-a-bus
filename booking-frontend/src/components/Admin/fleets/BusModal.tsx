import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Bus } from "@/types/bus.type";

interface BusModalProps {
  bus?: Bus | null;
  onClose: () => void;
  onSubmit: (bus: Bus) => void;
}

const EMPTY_BUS: Bus = {
  id: "",
  name: "",
  plateNumber: "",
  totalSeats: 24,
};

const BusModal: React.FC<BusModalProps> = ({ bus, onClose, onSubmit }) => {
  const [form, setForm] = useState<Bus>(EMPTY_BUS);

  useEffect(() => {
    setForm(bus ?? EMPTY_BUS);
  }, [bus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalBus: Bus = {
      ...form,
      id: form.id || crypto.randomUUID(),
    };

    onSubmit(finalBus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {bus ? "Chỉnh sửa xe" : "Thêm xe mới"}
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tên xe *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md p-2"
            />
          </div>

          {/* Plate */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Biển số *
            </label>
            <input
              type="text"
              name="plateNumber"
              value={form.plateNumber}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md p-2"
            />
          </div>

          {/* Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tổng số ghế *
            </label>
            <input
              type="number"
              name="totalSeats"
              min={1}
              value={form.totalSeats}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-md p-2"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {bus ? "Lưu thay đổi" : "Thêm xe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusModal;
