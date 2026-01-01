// =============================
// src/components/Admin/stations/StationList.tsx
// =============================
import { MapPin, Pencil, Trash2 } from "lucide-react";
import type { Station } from "@/types/station.type";

interface Props {
  stations: Station[];
  onEdit: (s: Station) => void;
  onDelete: (id: string) => void;
}

export const StationList = ({ stations, onEdit, onDelete }: Props) => {
  if (stations.length === 0) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-center text-muted-foreground">
        <MapPin className="w-10 h-10 mb-3 opacity-40" />
        <p className="font-medium">Chưa có điểm dừng nào</p>
        <p className="text-sm">Tạo điểm dừng đầu tiên để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 ">
      {stations.map((s) => (
        <div
          key={s.id}
          className="group rounded-lg border p-4 flex justify-between hover:bg-muted transition"
        >
          <div className="flex gap-3">
            <MapPin className="mt-1" />
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-muted-foreground">{s.address}</p>
              <p className="text-sm text-muted-foreground">{s.province}</p>
            </div>
          </div>

          <div className="hidden group-hover:flex gap-3">
            <button onClick={() => onEdit(s)}>
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(s.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
