import { type FC } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Trash2, Unlock } from "lucide-react";

interface UserActionsMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDisable: () => void;
}

const UserActionsMenu: FC<UserActionsMenuProps> = ({
  onView,
  onEdit,
  onDelete,
  onDisable,
}) => {
  return (
    <DropdownMenu>
      {/* Trigger: nút 3 chấm dọc */}
      <DropdownMenuTrigger>
        <button
          type="button"
          className="p-2 rounded-md hover:bg-gray-100 transition"
          aria-label="Mở menu hành động"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </DropdownMenuTrigger>

      {/* Nội dung menu */}
      <DropdownMenuContent align="end" className="p-1 min-w-[170px]">
        <DropdownMenuItem onClick={onView}>
          <Eye className="w-4 h-4 mr-2 text-gray-600" /> Xem chi tiết
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2 text-gray-600" /> Chỉnh sửa
        </DropdownMenuItem>

        <DropdownMenuItem onClick={onDisable}>
          <Unlock className="w-4 h-4 mr-2 text-gray-600" /> Kích hoạt
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsMenu;
