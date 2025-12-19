import React, { useState } from "react";
import UpdatePaymentSection from "./UpdatePaymentSection";
import type { Booking } from "../../../types/admin/booking";
import { X, Send, Pencil, XCircle } from "lucide-react";

const getStatusBadgeClass = (
  status: Booking["status"] | Booking["paymentStatus"],
) => {
  switch (status) {
    case "Đã xác nhận":
    case "Đã thanh toán":
      return "bg-green-100 text-green-800";
    case "Đang chờ":
    case "Chưa thanh toán":
      return "bg-yellow-100 text-yellow-800";
    case "Đã hủy":
    case "Đã hoàn tiền":
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
  const [paymentStatus, setPaymentStatus] = useState(booking.paymentStatus);

  if (!isOpen) return null;

  const detailedBooking = {
    ...booking,
    email: "a@example.com",
    phone: "0912345678",
    paymentMethod: "Momo",
    seat: "A1, A2",
  };

  const handleSavePayment = (newStatus: Booking["paymentStatus"]) => {
    setPaymentStatus(newStatus);
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div
        className="relative z-10 bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto"
        style={{ width: "600px" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
            Chi tiết đặt vé {detailedBooking.id}
          </h3>

          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(
                detailedBooking.status,
              )}`}
            >
              {detailedBooking.status}
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
              booking={{ ...detailedBooking, paymentStatus }}
              onSave={handleSavePayment}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <>
              {/* Thông tin đặt vé */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-3">
                  Thông tin đặt vé
                </h4>
                <InfoRow
                  label="Tên khách hàng"
                  value={detailedBooking.customer}
                />
                <InfoRow label="Điện thoại" value={detailedBooking.phone} />
                <InfoRow label="Email" value={detailedBooking.email} />
              </div>

              {/* Thông tin chuyến đi */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-3">
                  Thông tin chuyến đi
                </h4>
                <InfoRow label="Tuyến đường" value={detailedBooking.route} />
                <InfoRow
                  label="Ngày khởi hành"
                  value={detailedBooking.departureDate}
                />
                <InfoRow label="Số ghế" value={detailedBooking.seat} />
              </div>

              {/* Thông tin thanh toán */}
              <div className="border p-4 rounded-lg">
                <h4 className="font-bold text-gray-700 mb-3">
                  Thông tin thanh toán
                </h4>
                <InfoRow
                  label="Cổng thanh toán"
                  value={detailedBooking.paymentMethod}
                />
                <InfoRow label="Trạng thái" value={paymentStatus} />
                <InfoRow
                  label="Tổng tiền"
                  value={
                    <span className="text-xl text-blue-700 font-bold">
                      {detailedBooking.totalPrice}
                    </span>
                  }
                />
              </div>
            </>
          )}
        </div>

        {/* Footer: 3 nút trái + 1 nút phải */}
        {!isEditing && (
          <div className="flex justify-between items-center p-4 border-t bg-white rounded-b-lg">
            {/* Nhóm nút trái */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert("Resend ticket")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
                Gửi lại vé
              </button>

              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition cursor-pointer"
              >
                <Pencil className="w-4 h-4" strokeWidth={1.5} />
                Sửa đổi
              </button>

              <button
                onClick={() => alert("Cancel booking")}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition cursor-pointer"
              >
                <XCircle className="w-4 h-4" strokeWidth={1.5} />
                Hủy vé
              </button>
            </div>

            {/* Nút Đóng */}
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-800 transition cursor-pointer"
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
