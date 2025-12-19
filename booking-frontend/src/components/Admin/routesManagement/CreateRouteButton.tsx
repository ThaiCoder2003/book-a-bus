// components/trips/CreateRouteButton.tsx
import { Plus } from 'lucide-react';

interface CreateRouteButtonProps {
  onOpen: () => void;
}

export default function CreateRouteButton({ onOpen }: CreateRouteButtonProps) {
  return (
    <button
      onClick={onOpen}
      className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-md shadow-blue-200"
    >
      <Plus className="w-5 h-5" />
      <span>Tạo Tuyến đường Mới</span>
    </button>
  );
}
