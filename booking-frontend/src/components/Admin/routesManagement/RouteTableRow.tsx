import { MapPin, Trash2 } from "lucide-react";
import CustomTooltip from "./CustomTooltip";
import type { Route } from "@/types/route.type";
import routeService from "@/services/routeService";
import { toast } from "react-toastify";

interface Props {
  route: Route;
  onViewDetails: (routeId: string) => void;
  onDeleteSuccess: () => void;
}



export default function RouteTableRow({ route, onViewDetails, onDeleteSuccess }: Props) {
  const handleDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tuyến: ${route.name}? Tất cả chuyến xe thuộc tuyến này cũng sẽ bị xóa!`)) {
      try {
        // Gọi API xóa của bạn ở đây
        await routeService.delete(route.id);
        
        // Quan trọng: Phải gọi lại hàm fetchData() ở trang cha để cập nhật lại bảng
        toast.success("Xóa thành công!")
        onDeleteSuccess();
      } catch (error) {
        toast.error("Không thể xóa tuyến đường này!");
      }
    }
  };
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-3 py-4 font-medium">{route.name}</td>
      <td className="px-3 py-4">{route.startLocation ?? "Chưa xác định"}</td>
      <td className="px-3 py-4">{route.endLocation ?? "Chưa xác định"}</td>
      <td className="px-3 py-4 text-center"><span className="font-semibold">{route._count?.route_station ?? 0}</span> trạm</td>

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
            <button onClick={handleDelete} className="p-1 hover:bg-red-50 rounded text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </CustomTooltip>
        </div>
      </td>
    </tr>
  );
}
