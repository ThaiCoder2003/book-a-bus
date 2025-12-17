import RouteTableRow from "./RouteTableRow";
import { mockRoutes } from "../../types/route";

interface RouteTableProps {
  onViewDetails: (routeId: string | number) => void;
}

export default function RouteTable({ onViewDetails }: RouteTableProps) {
  return (
    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr className="border-b">
            <th className="p-3 w-[12%]">Tên Tuyến </th>
            <th className="p-3 w-[20%]">Thành phố khởi hành</th>
            <th className="p-3 w-[20%]">Thành phố đến</th>
            <th className="p-3 w-[15%] text-center">Số lượng điểm dừng</th>
            <th className="p-3 w-[15%] text-center">Thời gian ước tính</th>
            <th className="p-3 w-[15%] text-center">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {mockRoutes.map((item, i) => (
            <RouteTableRow key={i} data={item} onViewDetails={onViewDetails} />
          ))}
        </tbody>
      </table>

      <div className="text-sm text-gray-500 p-3">
        Hiển thị 1–{mockRoutes.length}/{mockRoutes.length} tuyến đường
      </div>
    </div>
  );
}
