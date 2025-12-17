import React, { useState } from "react";
import type { Booking } from "../../types/booking";
import { Send, Trash2, Check, X } from "lucide-react";

interface UpdatePaymentSectionProps {
  booking: Booking;
  onSave: (newStatus: Booking["paymentStatus"]) => void;
  onCancel: () => void;
}

const paymentStatusOptions = [
  "Đã thanh toán",
  "Chưa thanh toán",
  "Đã hoàn tiền",
];

const UpdatePaymentSection: React.FC<UpdatePaymentSectionProps> = ({
  booking,
  onSave,
  onCancel,
}) => {
  const [newPaymentStatus, setNewPaymentStatus] = useState(
    booking.paymentStatus,
  );

  const handleSave = () => {
    console.log(
      `Cập nhật trạng thái thanh toán: ${booking.id} → ${newPaymentStatus}`,
    );
    onSave(newPaymentStatus);
  };

  return (
    <div className="border p-4 rounded-lg bg-amber-50">
      <h4 className="font-semibold text-gray-700 mb-4 text-base">
        Cập nhật thủ công
      </h4>

      {/* Trạng thái thanh toán */}
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Trạng thái thanh toán
        </label>
        <select
          value={newPaymentStatus}
          onChange={(e) =>
            setNewPaymentStatus(e.target.value as Booking["paymentStatus"])
          }
          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {paymentStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Tổng tiền */}
      <div className="flex items-center mb-4">
        <span className="text-sm font-medium text-gray-700 mr-2">
          Tổng tiền:
        </span>
        <span className="text-xl font-bold text-red-600">
          {booking.totalPrice}
        </span>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        {/* Nhóm thao tác trái */}
        <div className="flex gap-2"></div>

        {/* Nhóm lưu */}
        <div className="flex gap-2">
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
    </div>
  );
};

export default UpdatePaymentSection;
