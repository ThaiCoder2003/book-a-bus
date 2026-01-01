import RouteTableRow from "./RouteTableRow";
import type { Route } from "@/types/route.type";

interface RouteTableProps {
  routes: Route[];
  onViewDetails: (routeId: string) => void;
  totalItems: number;
  onDeleteSuccess: () => void;
}

export default function RouteTable({ routes, onViewDetails, totalItems, onDeleteSuccess }: RouteTableProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr className="border-b">
            <th className="p-3">Tên Tuyến</th>
            <th className="p-3">Điểm đầu</th>
            <th className="p-3">Điểm cuối</th>
            <th className="p-3 text-center">Số điểm dừng</th>
            <th className="p-3 text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((route) => (
            <RouteTableRow
              key={route.id}
              route={route}
              onViewDetails={onViewDetails}
              onDeleteSuccess={onDeleteSuccess}
            />
          ))}
        </tbody>
      </table>

      <div className="text-sm text-gray-500 p-3">
        Hiển thị {routes.length} trên tổng số {totalItems} tuyến đường
      </div>
    </div>
  );
}
