import { X, CheckCircle, Download, RotateCcw } from "lucide-react";
import type { Booking } from "../../../types/booking.type";

export default function TransactionDetailModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: Booking | null;
}) {
  if (!isOpen || !data) return null;

  const isSuccess = data.status === "CONFIRMED";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>

        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <div className="text-2xl font-bold">
                {data.totalAmount.toLocaleString("vi-VN")} đ
              </div>
              <div className="text-sm text-emerald-600 font-medium">
                ● Hoàn thành
              </div>
            </div>
          </div>

          <div className="flex gap-2 flex-col">
            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm hover:bg-gray-50 cursor-pointer">
              <Download className="h-4 w-4" />
              Tải hóa đơn
            </button>

            <button className="flex items-center gap-2 px-4 py-2 border rounded-xl text-sm text-orange-600 hover:bg-orange-50 cursor-pointer">
              <RotateCcw className="h-4 w-4" />
              Hoàn tiền
            </button>
          </div>
        </div>

        <div className="border-t" />

        {/* Body */}
        <div className="p-6 grid grid-cols-2 gap-8 text-sm">
          {/* Transaction info */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-4">
              THÔNG TIN GIAO DỊCH
            </h4>

            <Info label="Mã giao dịch" value={data.id} />
            <Info label="PayOS ID" value={data.paymentRef ?? "—"} />
            <Info
              label="Thời gian"
              value={new Date(
                data.paymentTime ?? data.createdAt,
              ).toLocaleString("vi-VN")}
            />
            <Info label="Phương thức" value="ZaloPay Sandbox" />
          </div>

          {/* Customer info */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 mb-4">
              THÔNG TIN KHÁCH HÀNG
            </h4>

            <Info label="Họ tên" value={data.user?.name} />
            <Info label="Email" value={data.user?.email} />
            <Info label="Tuyến đường" value={data.trip?.route?.name} />
          </div>
        </div>

        {/* Payment detail */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-gray-400 mb-4">
              CHI TIẾT THANH TOÁN
            </h4>

            <Row
              label="Giá vé"
              value={`${data.totalAmount.toLocaleString()} đ`}
            />
            <Row label="Phí dịch vụ" value="0 đ" />

            <div className="border-t my-3" />

            <Row
              label="Tổng thanh toán"
              value={`${data.totalAmount.toLocaleString()} đ`}
              bold
              highlight
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }: { label: string; value?: string }) => (
  <div className="mb-3">
    <div className="text-xs text-gray-400">{label}</div>
    <div className="font-medium">{value ?? "—"}</div>
  </div>
);

const Row = ({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) => (
  <div className="flex justify-between items-center text-sm mb-2">
    <span className={bold ? "font-semibold" : ""}>{label}</span>
    <span
      className={`${bold ? "font-bold" : ""} ${
        highlight ? "text-blue-600 text-lg" : ""
      }`}
    >
      {value}
    </span>
  </div>
);
