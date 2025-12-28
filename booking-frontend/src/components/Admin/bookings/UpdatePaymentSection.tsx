import React, { useState } from "react";
import type { Booking } from "@/types/booking.type";
import { Check, X } from "lucide-react";

interface UpdatePaymentSectionProps {
  booking: Booking;
  onSave: (newTotalAmount: number) => void; // chỉ còn cập nhật totalAmount
  onCancel: () => void;
}

const UpdatePaymentSection: React.FC<UpdatePaymentSectionProps> = ({
  booking,
  onSave,
  onCancel,
}) => {
  const [newTotalAmount, setNewTotalAmount] = useState(booking.totalAmount);

  const handleSave = () => {
    console.log(`Cập nhật tổng tiền: ${booking.id} → ${newTotalAmount}`);
    onSave(newTotalAmount);
  };

  return (
    <div className="border p-4 rounded-lg bg-amber-50">
      <h4 className="font-semibold text-gray-700 mb-4 text-base">
        Cập nhật thủ công
      </h4>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Tổng tiền
        </label>
        <input
          type="number"
          value={newTotalAmount}
          onChange={(e) => setNewTotalAmount(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition"
        >
          <Check size={16} /> Lưu
        </button>

        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded hover:bg-gray-600 transition"
        >
          <X size={16} /> Đóng
        </button>
      </div>
    </div>
  );
};

export default UpdatePaymentSection;
