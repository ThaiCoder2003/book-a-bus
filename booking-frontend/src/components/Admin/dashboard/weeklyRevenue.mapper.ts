// mappers/weeklyRevenue.mapper.ts
import type { WeeklyRevenueAPI } from "@/types/api/weekly-revenue.api"
import type { WeeklyRevenueUI } from "@/types/ui/weekly-revenue.ui"

export const mapWeeklyRevenueApiToUI = (
  data: WeeklyRevenueAPI[]
): WeeklyRevenueUI[] =>
  data.map((item) => ({
    day: item.day,
    revenue: Number(item.totalAmount),
  }))
