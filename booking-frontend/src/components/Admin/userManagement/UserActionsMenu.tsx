import { type FC } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { MoreVertical, Eye, Edit, Trash2, Unlock, Loader2 } from "lucide-react";

interface UserActionsMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDisable: () => void;
  isLoading?: boolean;
}

const UserActionsMenu: FC<UserActionsMenuProps> = ({
  onView,
  onEdit,
  onDelete,
  onDisable,
  isLoading
}) => {
  return (
    <DropdownMenu>
      {/* Trigger: nút 3 chấm dọc */}
      <DropdownMenuTrigger>
        <button
          type="button"
          disabled={isLoading}
          className={`p-2 rounded-md transition ${
            isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-100"
          }`}
          aria-label="Mở menu hành động"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          ) : (
            <MoreVertical className="w-5 h-5 text-gray-600" />
          )}
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
