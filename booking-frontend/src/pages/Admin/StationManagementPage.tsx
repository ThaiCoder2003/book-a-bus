// =============================
// src/pages/Admin/StationManagementPage.tsx
// =============================
import { Plus } from "lucide-react";
import type { Station } from "@/types/station.type";
import { StationForm } from "@/components/Admin/stations/StationForm";
import { StationList } from "@/components/Admin/stations/StationList";
import { useEffect, useState } from "react";

import stationService from "@/services/stationService";
import { toast } from "react-toastify";

export default function StationManagementPage() {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Station | null>(null);
  const [numberStation, setNumberStation] = useState<number>(0)

  const fetchStations = async () => {
    try {
      const data = await stationService.getStations(); // Gọi service GET
      setStations(data.stations);
      setNumberStation(data.stationNumber);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách điểm dừng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchStations(); 
  }, []);

  const handleCreate = async (data: Omit<Station, "id">) => {
    setLoading(true)
    try {
        // 1. Gọi API thực tế
      const response = await stationService.registerNewStation(data);

      // 2. Nếu thành công, cập nhật danh sách hiển thị
      // Cách A: Thêm trực tiếp từ kết quả BE trả về (tiết kiệm request)
      setStations((prev) => [...prev, response]); 
      
      // Cách B: Gọi lại hàm fetchStations() để đảm bảo đồng bộ 100%
      // await fetchStations();

      setMode(null); // Đóng form
      toast.success("Tạo điểm dừng thành công!");
    } catch (error) {
    // 3. Xử lý khi có lỗi (ví dụ: trùng tên, mất mạng)
        console.error(error);
        const errorMessage = error instanceof Error ? error.message : "Không thể tạo điểm dừng";
        toast.error("Có lỗi xảy ra: " + errorMessage);
      }
    setMode(null);
  };

  const handleUpdate = async (formData: Omit<Station, "id">) => {
    if (!editing) return;
    setLoading(true);
    try {
      // Kết hợp ID của trạm đang sửa và dữ liệu mới từ Form
      const response = await stationService.updateStation(formData, editing.id);
      
      // Cập nhật lại state cục bộ để UI thay đổi ngay lập tức
      setStations((prev) =>
        prev.map((s) => (s.id === editing.id ? response : s))
      );
      
      setEditing(null);
      setMode(null);
      toast.success("Cập nhật thành công!");
    } catch (error: any) {
      toast.error("Lỗi cập nhật: " + (error.response?.data?.message || "Thất bại"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async(id: string) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa điểm dừng này không?");
    if (!isConfirmed) return;
    setLoading(true);
    try {
      // Kết hợp ID của trạm đang sửa và dữ liệu mới từ Form
      await stationService.deleteStation(id);

      setStations((prev) => prev.filter((s) => s.id !== id))
      
      setEditing(null);
      setMode(null);
      toast.success("Cập nhật thành công!");
    } catch (error: any) {
      toast.error("Lỗi cập nhật: " + (error.response?.data?.message || "Thất bại"));
    } finally {
      setLoading(false);
    }
  }

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
            isLoading={loading}
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
            {numberStation} điểm dừng
          </p>

          <StationList
            stations={stations}
            onEdit={(s) => {
              setEditing(s);
              setMode("edit");
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}
