// src/components/trips/StopsModal.tsx
import type { Stop } from "../../../types/admin/stop"; // dùng relative path
import { X } from "lucide-react";
import StopTimelineItem from "./StopTimelineItem";

interface StopsModalProps {
  routeName: string;
  estimatedTime: string;
  stops: Stop[];
  onClose: () => void;
}

export default function StopsModal({
  routeName,
  estimatedTime,
  stops,
  onClose,
}: StopsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl h-[90vh] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-5 border-b bg-white flex justify-between items-start sticky top-0 z-20">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900">
              Chi tiết Điểm dừng
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Tuyến:{" "}
              <span className="font-semibold text-blue-600">{routeName}</span> –{" "}
              Thời gian ước tính: {estimatedTime}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY (scrollable) */}
        <div className="px-6 py-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {stops.map((stop, index) => (
              <StopTimelineItem
                key={stop.order}
                stop={stop}
                isLast={index === stops.length - 1}
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
          >
            Đóng
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Chỉnh sửa tuyến
          </button>
        </div>
      </div>
    </div>
  );
}
