// types/api/weekly-revenue.api.ts
export interface WeeklyRevenueAPI {
  day: string; // "Mon" | "Tue" | ...
  totalAmount: string; // Decimal từ Prisma → string
}
