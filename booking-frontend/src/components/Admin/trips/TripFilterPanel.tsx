import { Search } from "lucide-react";
import type { Route } from "@/types/route.type";

interface TripFilter {
  searchTerm: string;
  routeId: string | "all";
}

interface Props {
  filter: TripFilter;
  setFilter: React.Dispatch<React.SetStateAction<TripFilter>>;
  routes: Route[];
}

export function TripFilterPanel({ filter, setFilter, routes }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Tìm kiếm theo ID, tuyến, tài xế, nhà xe..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={filter.searchTerm}
          onChange={(e) =>
            setFilter((p) => ({ ...p, searchTerm: e.target.value }))
          }
        />
      </div>

      {/* Selects Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Trạng thái
          </label>
          <select className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none">
            <option>Tất cả trạng thái</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tuyến đường
          </label>
          <select
            value={filter.routeId}
            onChange={(e) =>
              setFilter((p) => ({ ...p, routeId: e.target.value }))
            }
            className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none"
          >
            <option value="all">Tất cả tuyến đường</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Nhà xe
          </label>
          <select className="w-full p-2 border border-slate-200 rounded-lg bg-white outline-none">
            <option>Tất cả nhà xe</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="text-blue-600 text-sm font-medium hover:underline">
          Xóa tất cả bộ lọc
        </button>
      </div>
    </div>
  );
}
