import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import StatisticCard from "@/components/Admin/fleets/StatisticCard";
import BusCard from "@/components/Admin/fleets/BusCard";
import BusModal from "@/components/Admin/fleets/BusModal";
import SeatConfigModal from "@/components/Admin/fleets/SeatConfigModal";

import type { Bus } from "@/types/bus.type";
import busService from "@/services/busService";
import type { Seat } from "@/types/seat.type";
import { toast } from "react-toastify";

const SeatManagementPage: React.FC = () => {
  /* ===================== STATE ===================== */
  const [buses, setBuses] = useState<Bus[]>([]);
  const [busNum, setBusNum] = useState<number>(0);
  const [seatNum, setSeatNum] = useState<number>(0);
  const [searchInput, setSearchInput] = useState(""); 

  const [searchTerm, setSearchTerm] = useState("");
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const [isBusModalOpen, setIsBusModalOpen] = useState(false);
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);

  /* ===================== HANDLERS ===================== */

  const fetchBuses = async () => {
    try {
      const data = await busService.getBuses(searchTerm)

      setBuses(data.buses)
      setBusNum(data.countBus)
      setSeatNum(data.countSeat)
    } catch (error) {
      console.error("Failed to fetch routes", error);
    }
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    fetchBuses();
  }, [searchTerm]);


  const handleAddBus = () => {
    setEditingBus(null);
    setIsBusModalOpen(true);
  };

  const handleEditBus = (bus: Bus) => {
    setEditingBus(bus);
    setIsBusModalOpen(true);
  };

  const handleDeleteBus = (bus: Bus) => {
    setBuses((prev) => prev.filter((b) => b.id !== bus.id));
  };

const handleSubmitBus = async (busData: Bus) => {
  try {
    let resultBus: Bus;

    if (editingBus) {
      // TRƯỜNG HỢP EDIT
      resultBus = await busService.updateBus(editingBus.id, busData);
    } else {
      // TRƯỜNG HỢP ADD NEW
      resultBus = await busService.registernewBus(busData);
    }

    // Sau khi có kết quả từ Server, mới cập nhật UI
    setBuses((prev) => {
      const exists = prev.some((b) => b.id === resultBus.id);
      if (exists) {
        return prev.map((b) => (b.id === resultBus.id ? resultBus : b));
      }
      return [...prev, resultBus];
    });

    setIsBusModalOpen(false);
    setEditingBus(null);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    toast.error("Lỗi: " + errorMessage);
  }
};

// 2. Khi nhấn Cấu hình ghế
  const handleConfigSeat = async (bus: Bus) => {
    try {
      // Dùng bus.id để fetch lấy danh sách ghế chi tiết
      const fullData = await busService.getBusById(bus.id); 
      setSelectedBus(fullData); // Lưu data có kèm seats
      setIsSeatModalOpen(true);
    }  catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error("Lỗi: " + errorMessage);
    }
  };

  const handleSaveSeats = async (busId: string, updatedSeats: Seat[]) => {
    try {
      // 1. Gọi API gửi mảng ghế mới lên
      await busService.updateBusSeats(busId, updatedSeats);
      
      // 2. Thông báo thành công
      toast.success("Lưu cấu hình ghế thành công!");
      
      // 3. Đóng Modal và reset state
      setIsSeatModalOpen(false);
      setSelectedBus(null);
      
      // 4. Refresh lại danh sách bus để Statistic (tổng số ghế) cập nhật đúng
      fetchBuses(); 
    } catch (error) {
      console.error("Lỗi lưu ghế:", error);
      toast.error("Không thể lưu cấu hình ghế. Vui lòng thử lại!");
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quản lý đội xe</h1>
        <button
          onClick={handleAddBus}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          <Plus size={18} />
          Thêm xe
        </button>
      </div>

      {/* Statistic */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticCard title="Tổng số xe" value={busNum} />
        <StatisticCard
          title="Tổng số ghế"
          value={seatNum}
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Tìm theo tên xe hoặc biển số..."
          className="pl-10 pr-4 py-2 w-full border rounded-lg"
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {buses.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            onEdit={handleEditBus}
            onConfigSeat={handleConfigSeat}
            onDelete={handleDeleteBus}
          />
        ))}
      </div>

      {/* Modals */}
      {isBusModalOpen && (
        <BusModal
          bus={editingBus}
          onClose={() => setIsBusModalOpen(false)}
          onSubmit={handleSubmitBus}
        />
      )}

      {isSeatModalOpen && selectedBus && (
        <SeatConfigModal
          bus={selectedBus}
          seats={selectedBus.seats ?? []}
          onClose={() => setIsSeatModalOpen(false)}
          onSave={handleSaveSeats}
        />
      )}
    </div>
  );
};

export default SeatManagementPage;
