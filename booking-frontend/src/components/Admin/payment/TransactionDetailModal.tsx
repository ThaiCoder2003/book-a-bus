import {
  X,
  CheckCircle2,
  Download,
  RotateCcw,
  Copy,
  Clock,
  CreditCard,
  User,
  MapPin,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

export default function TransactionDetailModal({
  isOpen,
  onClose,
  data,
}: ModalProps) {
  if (!isOpen || !data) return null;

  // Hàm copy mã giao dịch nhanh
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép: " + text);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-xl overflow-hidden relative animate-in zoom-in duration-300">
        {/* Nút đóng góc trên */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          <h2 className="text-xl font-extrabold text-gray-800 mb-8">
            Chi tiết giao dịch
          </h2>

          {/* Header Modal: Trạng thái & Nút thao tác nhanh */}
          <div className="flex items-center gap-5 mb-10 pb-8 border-b border-gray-100">
            <div className="bg-emerald-100 p-3 rounded-full">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900 tracking-tight">
                {data.amount.toLocaleString()} đ
              </div>
              <div className="text-sm text-emerald-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Hoàn thành
              </div>
            </div>

            <div className="ml-auto flex flex-col gap-2">
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
                <Download className="h-3.5 w-3.5" /> Tải hóa đơn
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 text-orange-600 transition-all shadow-sm">
                <RotateCcw className="h-3.5 w-3.5" /> Hoàn tiền
              </button>
            </div>
          </div>

          {/* Body: Thông tin chia 2 cột */}
          <div className="grid grid-cols-2 gap-10 mb-10">
            {/* Cột trái: Thông tin giao dịch */}
            <div className="space-y-5">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Thông tin giao dịch
              </p>

              <InfoItem
                label="Mã giao dịch"
                value={data.id}
                icon={
                  <Copy
                    className="h-3 w-3 cursor-pointer hover:text-blue-500"
                    onClick={() => copyToClipboard(data.id)}
                  />
                }
              />

              <InfoItem
                label="PayOS ID"
                value={`PAYOS_${data.id.split("TXN")[1]}`}
                icon={
                  <Copy
                    className="h-3 w-3 cursor-pointer hover:text-blue-500"
                    onClick={() => copyToClipboard("PAYOS_ID")}
                  />
                }
              />

              <InfoItem label="Thời gian" value={data.time} />
              <InfoItem label="Phương thức" value={data.method} />
            </div>

            {/* Cột phải: Thông tin khách hàng */}
            <div className="space-y-5">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                Thông tin khách hàng
              </p>

              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-medium">
                  Họ tên:
                </label>
                <div className="font-bold text-gray-800 text-sm">
                  {data.customer}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-medium">
                  Email:
                </label>
                <div className="font-bold text-gray-800 text-sm truncate">
                  {data.email}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 text-xs font-medium">
                  Tuyến đường:
                </label>
                <div className="font-bold text-gray-800 text-xs leading-relaxed">
                  {data.route}
                </div>
              </div>
            </div>
          </div>

          {/* Phần Footer: Chi tiết thanh toán (Giống thiết kế ảnh của bạn) */}
          <div className="bg-gray-50/80 rounded-2xl p-6 space-y-3">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Chi tiết thanh toán
            </p>

            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Giá vé:</span>
              <span className="font-bold">
                {data.amount.toLocaleString()} đ
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span className="font-medium">Phí dịch vụ:</span>
              <span className="font-bold">0 đ</span>
            </div>

            <div className="pt-4 mt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-base font-extrabold text-gray-800">
                Tổng thanh toán:
              </span>
              <span className="text-xl font-black text-blue-600">
                {data.amount.toLocaleString()} đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component con hiển thị dòng thông tin nhỏ
function InfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-gray-400 text-xs font-medium">{label}:</label>
      <div className="flex items-center gap-2">
        <span className="font-bold text-gray-800 text-sm">{value}</span>
        {icon && <span className="text-gray-400">{icon}</span>}
      </div>
    </div>
  );
}
