import { Clock, MapPin, Route } from "lucide-react";
import type { RouteStation } from "@/types/RouteStation.type";

interface Props {
  routeStation: RouteStation;
  isLast: boolean;
}

export default function StopTimelineItem({ routeStation, isLast }: Props) {
  const { order, station, durationFromStart, distanceFromStart } = routeStation;

  const isStart = order === 1;
  const isEnd = isLast;
  const isMiddle = !isStart && !isEnd;

  return (
    <div className="relative flex">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-4 top-8 w-0.5 h-[calc(100%-2rem)] bg-gray-200" />
      )}

      {/* Number circle */}
      <div
        className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
          ${
            isMiddle
              ? "bg-white text-gray-800 border-2 border-blue-500"
              : "bg-blue-600 text-white"
          }
        `}
      >
        {order}
      </div>

      {/* Content */}
      <div className="ml-4 flex-1">
        {/* Station name */}
        <h3
          className={`text-[15px] font-semibold ${
            isMiddle ? "text-gray-900" : "text-blue-600"
          }`}
        >
          {station?.name}
        </h3>

        {/* Address */}
        <div className="flex items-center text-sm text-gray-500 mt-0.5">
          <MapPin className="w-4 h-4 mr-1 text-blue-500" />
          {station?.address}
        </div>

        {/* Time */}
        <div className="flex items-center gap-6 mt-2 text-sm">
          <div className="flex items-center text-gray-700">
            <Clock className="w-4 h-4 mr-1 text-green-500" />
            Thời gian dự kiến:
            <span className="font-medium ml-1">{durationFromStart}p</span>
          </div>

          <div className="flex items-center text-gray-700">
            <Route className="w-4 h-4 mr-1 text-orange-500" />
            Quảng đường dự kiến:
            <span className="font-medium ml-1">{distanceFromStart}km</span>
          </div>
        </div>

        {/* Badge chỉ cho start / end */}
        {(isStart || isEnd) && (
          <span
            className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-md
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
