const prisma = require('../configs/db')
const { startOfDay, endOfDay, subDays,  startOfYear, endOfYear } = require('date-fns');
const { BusStatus, BookingStatus } = require('@prisma/client')

const todayStart = startOfDay(new Date());
const todayEnd = endOfDay(new Date());
const yesterdayStart = startOfDay(subDays(new Date(), 1));
const yesterdayEnd = endOfDay(subDays(new Date(), 1));

const dashboardService = {
    summary: async() => {
        const [
            todayRevenue,
            todayTicketCount,
            runningBus,
            maintenanceBus,
        ] = await Promise.all([

            prisma.ticket.aggregate({
                _sum: { price: true },
                where: {
                    createdAt: {
                        gte: todayStart,
                        lte: todayEnd 
                    },
                },
            }) ?? 0,

            prisma.ticket.count({
                where: {
                    createdAt: {
                        gte: todayStart,
                        lte: todayEnd 
                    }
                }
            }),

            prisma.bus.count({
                where: {
                    busStatus: BusStatus.RUNNING
                }
            }),

            prisma.bus.count({
                where: {
                    busStatus: BusStatus.MAINTENANCE
                }
            })
        ]);

        const revenue = todayRevenue._sum.price ?? 0

        const yesterdayRevenue = await prisma.ticket.aggregate({
            _sum: { price: true },
            where: {
                createdAt: {
                    gte: yesterdayStart,
                    lte: yesterdayEnd
                },
            },
        });

        const yesterday = yesterdayRevenue._sum.price ?? 0

        let revenueGrowth = 0
        if (yesterday > 0) {
            revenueGrowth = (( revenue - yesterday ) / yesterday ) * 100;
        }

        const yesterdayTicket = await prisma.ticket.count({
            where: {
                createdAt: {
                    gte: yesterdayStart,
                    lte: yesterdayEnd
                },
            },
        });


        let ticketGrowth = 0

        if (yesterdayTicket < 0) {
            ticketGrowth = ((todayTicketCount - yesterdayTicket) / yesterdayTicket) * 100
        }

        return {
            revenue: {
                revenue: todayRevenue,
                tickets: todayTicketCount,
                runningBus: runningBus,
                maintenanceBus: maintenanceBus,
                revenuegrowth: revenueGrowth,
                ticketGrowth: ticketGrowth
            }
        }
    },

    weeklyChart: async() => {
        const rawData = await prisma.$queryRaw`
        SELECT
            EXTRACT(ISODOW FROM "createdAt") AS day,
            COALESCE(SUM(price), 0) AS revenue
        FROM "Ticket"
        WHERE "createdAt" BETWEEN ${todayStart} AND ${todayEnd}
        GROUP BY day
        `

        const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

        const weeklyRevenue = WEEK_DAYS.map((day, index) => {
            const found = rawData.find(r => Number(r.day) === index + 1);

            return {
                day,
                revenue: Number(found?.revenue ?? 0),
            };
        })

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