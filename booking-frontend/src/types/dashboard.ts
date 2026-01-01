export interface DashboardSummary {
  revenue: number;
  tickets: number;
  busCount: number;
  revenueGrowth: number;
  ticketGrowth: number;
}

export interface WeeklyChartData {
  label: string;
  revenue: number;
}

export interface FinanceAnalysis {
  id: string;
  revenue: number;
  revenueGrowth: number;
  successfulBooking: number;
  successfulBookingGrowth: number;
  newUsers: number;
  customerTrend: number;
  refundThisMonth: number;
  refundTrend: number;
}

export interface Revenue {
  name: string; 
  revenue: number; 
}