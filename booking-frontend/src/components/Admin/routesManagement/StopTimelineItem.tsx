// src/components/trips/StopTimelineItem.tsx
import type { Stop } from "../../../types/admin/stop"; // dùng relative path
import { Clock, MapPin } from "lucide-react";

interface StopItemProps {
  stop: Stop;
  isLast: boolean;
}

export default function StopTimelineItem({ stop, isLast }: StopItemProps) {
  const isStart = stop.type === "start";
  const isEnd = stop.type === "end";

  return (
    <div className="relative flex">
      {/* Vertical Line */}
      {!isLast && (
        <div className="absolute left-4 top-7 w-0.5 h-[calc(100%-1.75rem)] bg-gray-200"></div>
      )}

      {/* Number Circle */}
      <div
        className={`z-10 w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold
          ${
            isStart || isEnd
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 border-2 border-blue-400"
          }
        `}
      >
        {stop.order}
      </div>

      {/* Content */}
      <div className="ml-4 flex-1">
        <h3
          className={`text-[15px] font-semibold ${
            isStart || isEnd ? "text-blue-600" : "text-gray-900"
          }`}
        >
          {stop.name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mt-1">
          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
          {stop.address}
        </div>

        <div className="flex items-center gap-8 mt-3 mb-1">
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="w-4 h-4 mr-1 text-green-500" />
            Đến dự kiến:
            <span className="font-medium ml-1">{stop.arrivalTime}</span>
          </div>

          <div className="flex items-center text-sm text-gray-700">
            <Clock className="w-4 h-4 mr-1 text-orange-500" />
            Đi dự kiến:
            <span className="font-medium ml-1">{stop.departureTime}</span>
          </div>
        </div>

        {(isStart || isEnd) && (
          <span
            className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md mt-1
              ${
                isStart
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {isStart ? "Điểm khởi hành" : "Điểm kết thúc"}
          </span>
        )}
      </div>
    </div>
  );
}
