import axiosClient from './axiosConfig'

import type { DashboardSummary, FinanceAnalysis, Revenue, WeeklyChartData } from "@/types/admin/dashboard";
import type { TransactionUI } from "@/types/ui/transaction.ui";
import type { Booking } from "@/types/booking.type";
const dashboardService = {
    summary: (): Promise<DashboardSummary> => 
        axiosClient.get('/adminDashboard/summary').then(res => res.data),

    WeeklyChart: (): Promise<WeeklyChartData[]> => axiosClient.get('/adminDashboard/weekly-chart').then(res => res.data),
    recentBooking: (): Promise<TransactionUI[]> => axiosClient.get('/adminDashboard/recent-booking').then(res => res.data),
    getFinanceAnalysis: (): Promise<FinanceAnalysis> => axiosClient.get('/adminDashboard/finance-analysis').then(res => res.data),
    getMonthlyRevenue: (): Promise<Revenue[]> => axiosClient.get('/adminDashboard/monthly-revenue').then(res => res.data),
    getTransactions: ():Promise<Booking[]> => axiosClient.get('/adminDashboard/transactions').then(res => res.data),
}
export default dashboardService