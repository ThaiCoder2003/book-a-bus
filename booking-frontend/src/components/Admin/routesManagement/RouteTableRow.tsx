import { MapPin, Trash2 } from "lucide-react";
import CustomTooltip from "./CustomTooltip";
import type { Route } from "@/types/route.type";

interface Props {
  route: Route;
  onViewDetails: (routeId: string) => void;
}

export default function RouteTableRow({ route, onViewDetails }: Props) {
  const stops = route.stops ?? [];

  const start = stops[0]?.station?.name ?? "-";
  const end = stops.at(-1)?.station?.name ?? "-";

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-3 py-4 font-medium">{route.name}</td>
      <td className="px-3 py-4">{start}</td>
      <td className="px-3 py-4">{end}</td>
      <td className="px-3 py-4 text-center">{stops.length}</td>

      <td className="px-3 py-4 text-center">
        <div className="flex justify-center gap-3">
          <CustomTooltip content="Xem chi tiết các điểm dừng">
            <button
              onClick={() => onViewDetails(route.id)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MapPin className="w-4 h-4" />
            </button>
          </CustomTooltip>

          <CustomTooltip content="Xóa tuyến đường">
            <button className="p-1 hover:bg-red-50 rounded text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </CustomTooltip>
        </div>
      </td>
    </tr>
  );
}
