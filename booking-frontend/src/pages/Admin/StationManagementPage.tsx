// =============================
// src/pages/Admin/StationManagementPage.tsx
// =============================
import { Plus } from "lucide-react";
import type { Station } from "@/types/station.type";
import { StationForm } from "@/components/Admin/stations/StationForm";
import { StationList } from "@/components/Admin/stations/StationList";
import React from "react";
import { mockStations } from "@/data/mockStations";

export default function StationManagementPage() {
  const [stations, setStations] = React.useState<Station[]>(mockStations);
  const [mode, setMode] = React.useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = React.useState<Station | null>(null);

  const handleCreate = (data: Omit<Station, "id">) => {
    setStations((prev) => [...prev, { id: crypto.randomUUID(), ...data }]);
    setMode(null);
  };

  const handleUpdate = (data: Omit<Station, "id">) => {
    if (!editing) return;
    setStations((prev) =>
      prev.map((s) => (s.id === editing.id ? { ...s, ...data } : s)),
    );
    setEditing(null);
    setMode(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Điểm dừng</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý các điểm dừng cho tuyến đường của bạn
          </p>
        </div>
        <button
          onClick={() => setMode("create")}
          className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tạo điểm dừng
        </button>
      </div>

      <div className="flex gap-6">
        {mode && (
          <StationForm
            mode={mode}
            initialData={editing}
            onCancel={() => {
              setMode(null);
              setEditing(null);
            }}
            onSubmit={mode === "create" ? handleCreate : handleUpdate}
          />
        )}

        <div className="flex-1 bg-white rounded-xl border p-6  shadow-lg">
          <h3 className="font-semibold mb-1">Danh sách điểm dừng</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {stations.length} điểm dừng
          </p>

          <StationList
            stations={stations}
            onEdit={(s) => {
              setEditing(s);
              setMode("edit");
            }}
            onDelete={(id) =>
              setStations((prev) => prev.filter((s) => s.id !== id))
            }
          />
        </div>
      </div>
    </div>
  );
}
