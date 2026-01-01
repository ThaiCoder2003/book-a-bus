import { X } from "lucide-react";
import type { Route } from "@/types/route.type";
import StopTimelineItem from "./StopTimelineItem";

interface Props {
  route: Route;
  onClose: () => void;
  isLoading?: boolean;
}

export default function StopsModal({ route, onClose, isLoading }: Props) {
  if (!route && !isLoading) return null;
  const stops = route.stops ? [...route.stops] : [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-xl h-[90vh] rounded-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5 border-b flex justify-between">
          <h2 className="text-lg font-bold">{route.name || "Tuyến đường không tên"}</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto flex-1 space-y-6">
          {stops
            .sort((a, b) => a.order - b.order)
            .map((rs, idx) => (
              <StopTimelineItem
                key={rs.id}
                routeStation={rs}
                isLast={idx === stops.length - 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
