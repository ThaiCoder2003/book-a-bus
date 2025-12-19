// src/components/trips/RouteTableRow.tsx

import { Pencil, Trash2, MapPin } from "lucide-react"; 
import CustomTooltip from "./CustomTooltip";

// 1. KHAI BÁO INTERFACES RÕ RÀNG
interface RouteData {
  id: number; // ID tuyến đường (đã đồng bộ với RouteTable)
  name: string;
  from: string;
  to: string;
  stops: number;
  time: string;
}

interface RouteTableRowProps {
    data: RouteData;
    // THÊM PROP XỬ LÝ SỰ KIỆN: nhận một hàm, hàm này nhận routeId (number)
    onViewDetails: (routeId: number) => void; 
}


// 2. NHẬN PROPS ĐƯỢC CHỈ ĐỊNH (thay thế { data }: any)
export default function RouteTableRow({ data, onViewDetails }: RouteTableRowProps): JSX.Element { 
    
    // Hàm này sẽ gọi prop onViewDetails được truyền từ RouteTable xuống
    const handleDetailClick = () => {
        onViewDetails(data.id);
    };

    return (
        <tr className="border-b hover:bg-gray-50 transition duration-150">
            <td className="px-3 py-4 text-sm font-medium text-gray-900">{data.name}</td>
            <td className="px-3 py-4 text-sm text-gray-600">{data.from}</td>
            <td className="px-3 py-4 text-sm text-gray-600">{data.to}</td> {/* Đã sửa 'text-gray-600r' */}
            <td className="px-3 py-4 text-sm text-gray-600 text-center">{data.stops}</td>
            <td className="px-3 py-4 text-sm text-gray-600 text-center">{data.time}</td>

            <td className="px-3 py-4 text-sm text-center"> {/* Đã sửa 'text-cente' */}
                <div className="flex justify-center gap-3">
                    <CustomTooltip content="Xem chi tiết các điểm dừng">
                        <button
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-50 transition duration-150 cursor-pointer"
                            onClick={handleDetailClick} // <-- GỌI HÀM ĐÃ ĐƯỢC ĐỊNH NGHĨA VÀO COMPONENT
                        >
                            <MapPin className="w-4 h-4" />
                        </button>
                    </CustomTooltip>
                    
                    
                    <CustomTooltip content="Xóa tuyến đường">
                        <button className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </CustomTooltip>
                </div>
            </td>
        </tr>
    );
}