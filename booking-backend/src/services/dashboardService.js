const prisma = require('../configs/db')
const { BusStatus, BookingStatus } = require('@prisma/client')
const { startOfYear, endOfYear, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay, subDays, format } = require('date-fns');

const dashboardService = {
    summary: async() => {
        const now = new Date();
        const yesterday = subDays(now, 1);
        const [
            monthRevenue,
            todayTicketCount,
            busCount,
            lastMonthRevenueData, 
            yesterdayTicketCount
        ] = await Promise.all([

            prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: {
                    createdAt: {
                        gte: startOfMonth(now),
                        lte: endOfMonth(now)
                    },

                    status: BookingStatus.CONFIRMED
                },
            }),

            prisma.ticket.count({
                where: {
                    booking: {
                        // Lọc Ticket dựa trên thông tin của Booking sở hữu nó
                        createdAt: {
                            gte: startOfDay(now),
                            lte: endOfDay(now)
                        },
                        status: BookingStatus.CONFIRMED
                    }
                }
            }),

            prisma.bus.count(),

            prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: {
                    createdAt: {
                        gte: startOfMonth(subMonths(now, 1)),
                        lte: endOfMonth(subMonths(now, 1))
                    },
                },
            }),
            // Số vé ngày hôm qua
            prisma.booking.count({
                where: {
                    createdAt: {
                        gte: startOfDay(yesterday),
                        lte: endOfDay(yesterday)
                    },
                },
            })
        ]);

        const revenue = Number(monthRevenue?._sum?.totalAmount || 0)
        const lastMonthRevenue = Number(lastMonthRevenueData?._sum?.totalAmount || 0);

    // Tính toán tăng trưởng %
        const revenueGrowth = lastMonthRevenue > 0 
            ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100 
            : (revenue > 0 ? 100 : 0);

        const ticketGrowth = yesterdayTicketCount > 0 
            ? ((todayTicketCount - yesterdayTicketCount) / yesterdayTicketCount) * 100 
            : (todayTicketCount > 0 ? 100 : 0);
        return {
            revenue,
            tickets: todayTicketCount,
            busCount,
            revenueGrowth: Number(revenueGrowth.toFixed(2)),
            ticketGrowth: Number(ticketGrowth.toFixed(2))
        }
    },

    weeklyChart: async() => {
        const sevenDaysAgo = startOfDay(subDays(new Date(), 6));
        const rawData = await prisma.$queryRaw`
        SELECT
            DATE_TRUNC('day', "createdAt") AS date,
            SUM("totalAmount")::FLOAT AS revenue
        FROM "Booking"
        WHERE "createdAt" BETWEEN ${sevenDaysAgo} AND ${new Date()}
            AND "status" = 'CONFIRMED'
        GROUP BY date
        `

        const weeklyRevenue = Array.from({ length: 7 }).map((_, i) => {
            const date = subDays(new Date(), 6 - i);
            const label = format(date, "dd/MM");

            const found = rawData.find(
            r =>
                new Date(r.date).toDateString() === date.toDateString()
            );

            return {
                label,
                revenue: Number(found?.revenue ?? 0),
            };
        });

        return weeklyRevenue
    },

    recentBooking: async() => {
        const recentBooking = await prisma.booking.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },

            take: 5
        })

        return recentBooking
    },

    getTransactions: async () => {
        return await prisma.booking.findMany({
            take: 20, // Lấy 20 giao dịch gần nhất
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                trip: {
                    include: 
                    {
                        route: { select: { name: true } }
                    }
                }
            }
        });
    },

    financeAnalysis: async() => {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [totalAllTime, thisMonth, lastMonth, 
        successfulBooking, successfulThisMonth, successfulLastMonth,
        newUsersCount, oldUsersCount,
        refundThisMonth, refundLastMonth] = await Promise.all([
            // 1. Doanh thu toàn thời gian
            prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: { status: BookingStatus.CONFIRMED }
            }),
            // 2. Doanh thu tháng này
            prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: { 
                    status: BookingStatus.CONFIRMED,
                    createdAt: { gte: startOfThisMonth, lte: endOfThisMonth}
                }
            }),
            // 3. Doanh thu tháng trước
            prisma.booking.aggregate({
                _sum: { totalAmount: true },
                where: { 
                    status: BookingStatus.CONFIRMED,
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
                }
            }),

            // 4. Số vé đã bán toàn thời gian
            prisma.booking.count({
                where: { status: BookingStatus.CONFIRMED }
            }),
            // 5. Số vé đã bán tháng này
            prisma.booking.count({
                where: { 
                    status: BookingStatus.CONFIRMED,
                    createdAt: { gte: startOfThisMonth, lte: endOfThisMonth }
                }
            }),
            // 6. Số vé đã bán tháng trước
            prisma.booking.count({
                where: { 
                    status: BookingStatus.CONFIRMED,
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
                }
            }),

            // 7. Số khách hàng mới trong 30 ngày qua
            prisma.user.count({
                where: {
                    createdAt: { gte: thirtyDaysAgo }
                }
            }),
            prisma.user.count({
                where: {
                    createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo }
                }
            }),

            // 8. Số dơn hủy tháng này và tháng trước (chưa dùng)
            prisma.booking.count({
                where: { 
                    status: BookingStatus.CANCELLED,
                    createdAt: { gte: startOfThisMonth, lte: endOfThisMonth }
                }
            }),
            
            prisma.booking.count({
                where: { 
                    status: BookingStatus.CANCELLED,
                    createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }
                }
            }),
        ]);

        const totalRevenue = Number(totalAllTime?._sum?.totalAmount || 0)

        const revenue = Number(thisMonth?._sum?.totalAmount || 0)
        const lastMonthRevenue = Number(lastMonth?._sum?.totalAmount || 0);

        // Tính toán tăng trưởng %
        const revenueGrowth = lastMonthRevenue > 0 
            ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100 
            : (revenue > 0 ? 100 : 0);

        const successfulBookingGrowth = successfulLastMonth > 0 
            ? ((successfulThisMonth - successfulLastMonth) / successfulLastMonth) * 100 
            : (successfulThisMonth > 0 ? 100 : 0);

        const customerTrend = oldUsersCount > 0 
            ? ((newUsersCount - oldUsersCount) / oldUsersCount) * 100 
            : (newUsersCount > 0 ? 100 : 0);

        const refundTrend = refundLastMonth > 0
            ? ((refundThisMonth - refundLastMonth) / refundLastMonth) * 100
            : (refundThisMonth > 0 ? 100 : 0);

        return {
            revenue: totalRevenue,
            revenueGrowth: Number(revenueGrowth.toFixed(2)),
            successfulBooking,
            successfulBookingGrowth: Number(successfulBookingGrowth.toFixed(2)),
            newUsers: newUsersCount,
            customerTrend: Number(customerTrend.toFixed(2)),
            refundThisMonth,
            refundTrend: Number(refundTrend.toFixed(2))
        }
    },

    monthlyRevenue: async() => {
        const now = new Date();
        const monthStart = startOfMonth(now)
        const currentMonth = now.getMonth() + 1;
        const daysOfMonth = Array.from({ length: new Date().getDate() }, (_, i) => i + 1);

        const rawData = await prisma.$queryRaw`
            SELECT 
                EXTRACT(DAY FROM "createdAt")::INTEGER AS day, 
                COALESCE(SUM("totalAmount"), 0) AS revenue
            FROM "Booking"
            WHERE 
                "status" = ${BookingStatus.CONFIRMED}::"BookingStatus" AND 
                "createdAt" >= ${monthStart} AND 
                "createdAt" <= ${now}
            GROUP BY day
            ORDER BY day ASC
        `;

        const mappedRevenue = daysOfMonth.map(day => {
            const found = rawData.find(r => r.day === day);

            return{
                name: `${day.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}`,
                revenue: Number(found?.revenue ?? 0)
            }
        })

        return mappedRevenue
    },
};

module.exports = dashboardService