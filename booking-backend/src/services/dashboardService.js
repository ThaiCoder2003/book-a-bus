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

            prisma.ticket.aggregate({
                _sum: { price: true },
                where: {
                    createdAt: {
                    gte: startOfMonth(now),
                    lte: now
                    },
                },
            }),

            prisma.ticket.count({
                where: {
                    createdAt: {
                        gte: startOfDay(now),
                        lte: endOfDay(now)
                    }
                }
            }),

            prisma.bus.count(),

                        prisma.ticket.aggregate({
                _sum: { price: true },
                where: {
                    createdAt: {
                        gte: startOfMonth(subMonths(now, 1)),
                        lte: endOfMonth(subMonths(now, 1))
                    },
                },
            }),
            // Số vé ngày hôm qua
            prisma.ticket.count({
                where: {
                    createdAt: {
                        gte: startOfDay(yesterday),
                        lte: endOfDay(yesterday)
                    },
                },
            })
        ]);

        const revenue = Number(monthRevenue?._sum?.price || 0)
        const lastMonthRevenue = Number(lastMonthRevenueData?._sum?.price || 0);

    // Tính toán tăng trưởng %
        const revenueGrowth = lastMonthRevenue > 0 
            ? ((revenue - lastMonthRevenue) / lastMonthRevenue) * 100 
            : (revenue > 0 ? 100 : 0);

        const ticketGrowth = yesterdayTicketCount > 0 
            ? ((todayTicketCount - yesterdayTicketCount) / yesterdayTicketCount) * 100 
            : (todayTicketCount > 0 ? 100 : 0);
        return {
            revenue: {
                revenue,
                tickets: todayTicketCount,
                busCount,
                revenueGrowth: Number(revenueGrowth.toFixed(2)),
                ticketGrowth: Number(ticketGrowth.toFixed(2))
            }
        }
    },

    weeklyChart: async() => {
        const sevenDaysAgo = subDays(new Date(), 6);
        const rawData = await prisma.$queryRaw`
        SELECT
            DATE("createdAt") AS date,
            COALESCE(SUM(price), 0) AS revenue
        FROM "Ticket"
        WHERE "createdAt" BETWEEN ${sevenDaysAgo} AND ${new Date()}
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

        return {
            weeklyRevenue
        }
    },

    recentBooking: async() => {
        const recentBooking = await prisma.booking.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                trip: {
                    include: {
                        bus: true,
                        originStation: true,
                        destStation: true,
                        route: true,
                    }
                },
                
                user: true,
                tickets: true
            },

            take: 5
        })

        return {
            recentBooking
        }
    },

    yearlyRevenue: async() => {
        const yearStart = startOfYear(new Date())
        const yearEnd = endOfYear(new Date())  
        const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        const rawData = await prisma.$queryRaw`
        SELECT
            EXTRACT(MONTH FROM "createdAt") AS month,
            COALESCE(SUM("totalAmount"), 0) AS revenue
        FROM "Booking"
        WHERE
        "status" = ${BookingStatus.CONFIRMED} AND
            "createdAt" BETWEEN ${yearStart} AND ${yearEnd}
        GROUP BY month
        `

        
        const yearlyRevenue = MONTHS.map((label, index) => {
            const found = rawData.find(
                r => Number(r.month) === index + 1
            )

            return {
                label,
                value: Number(found?.revenue ?? 0)
            }
        })

        return { yearlyRevenue }
    }
};

module.exports = dashboardService