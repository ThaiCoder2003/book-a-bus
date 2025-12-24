// BookingDetailModal.tsx
import React, { useState } from "react";
import UpdatePaymentSection from "./UpdatePaymentSection";
import type { Booking } from "../../../types/booking.type";
import { X, Send, Pencil, XCircle } from "lucide-react";

const getStatusBadgeClass = (status: Booking["status"]) => {
  switch (status) {
    case "CONFIRMED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex justify-between py-1 text-sm">
    <span className="text-gray-500">{label}:</span>
    <span className="font-medium text-gray-800">{value}</span>
  </div>
);

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết đặt vé {booking.id}
          </h3>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                booking.status,
              )}`}
            >
              {booking.status}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Nội dung */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {isEditing ? (
            <UpdatePaymentSection
              booking={booking}
              onSave={() => setIsEditing(false)}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {/* Thông tin khách hàng */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-3">
                  Thông tin khách hàng
                </h4>
                <InfoRow
                  label="Tên khách hàng"
                  value={booking.user?.name || "N/A"}
                />
                <InfoRow
                  label="Điện thoại"
                  value={booking.user?.phone || "N/A"}
                />
                <InfoRow label="Email" value={booking.user?.email || "N/A"} />
              </div>

              {/* Thông tin chuyến đi */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-3">
                  Thông tin chuyến đi
                </h4>
                <InfoRow
                  label="Tuyến đường"
                  value={booking.trip?.route?.name || "N/A"}
                />
                <InfoRow
                  label="Bến đi"
                  value={booking.departureStation?.name || "N/A"}
                />
                <InfoRow
                  label="Bến đến"
                  value={booking.arrivalStation?.name || "N/A"}
                />
                <InfoRow
                  label="Ngày khởi hành"
                  value={booking.trip?.departureTime || "N/A"}
                />
                <InfoRow label="Số vé" value={booking.tickets?.length || 0} />
              </div>

              {/* Thông tin thanh toán */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-3">
                  Thông tin thanh toán
                </h4>
                <InfoRow
                  label="Tổng tiền"
                  value={
                    <span className="text-xl text-blue-700 font-bold">
                      {booking.totalAmount}
                    </span>
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isEditing && (
          <div className="flex justify-between items-center p-4 border-t bg-white rounded-b-lg">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert("Resend ticket")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
                Gửi lại vé
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                <Pencil className="w-4 h-4" strokeWidth={1.5} />
                Sửa đổi
              </button>

              <button
                onClick={() => alert("Cancel booking")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
              >
                <XCircle className="w-4 h-4" strokeWidth={1.5} />
                Hủy vé
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition"
            >
              Xác nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailModal;
