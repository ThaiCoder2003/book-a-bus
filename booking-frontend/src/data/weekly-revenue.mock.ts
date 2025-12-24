// mock/weekly-revenue.mock.ts
import type { WeeklyRevenueAPI } from "@/types/api/weekly-revenue.api";

export const WEEKLY_REVENUE_MOCK: WeeklyRevenueAPI[] = [
  { day: "Mon", totalAmount: "2000000" },
  { day: "Tue", totalAmount: "1500000" },
  { day: "Wed", totalAmount: "2500000" },
  { day: "Thu", totalAmount: "1800000" },
  { day: "Fri", totalAmount: "4000000" },
  { day: "Sat", totalAmount: "5500000" },
  { day: "Sun", totalAmount: "6000000" },
];
