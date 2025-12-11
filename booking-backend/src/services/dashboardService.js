const prisma = require('../configs/db')

const now = new Date()

const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

const dashboardService = {
    summary: async() => {
        const [
            userCount,
            busCount,
            tripCount,
            ticketCount,
            todayRevenue
        ] = await Promise.all([
            prisma.user.count(),

            prisma.bus.count(),

            prisma.trip.count(),

            prisma.ticket.count(),

            prisma.ticket.aggregate({
                _sum: { price: true },
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0,0,0,0)),
                    },
                },
            })
        ]);

        const thisMonthAgg = await prisma.booking.aggregate({
            _sum: { totalAmount: true },
            where: {
                status: "CONFIRMED",
                createdAt: {
                    gte: startOfThisMonth,
                    lt: startOfNextMonth
                }
            }
        });

                const lastMonthAgg = await prisma.booking.aggregate({
            _sum: { totalAmount: true },
            where: {
                status: "CONFIRMED",
                createdAt: {
                    gte: startOfLastMonth,
                    lt: startOfThisMonth
                }
            }
        })

        const current = thisMonthAgg._sum.totalAmount || 0
        const previous = lastMonthAgg._sum.totalAmount || 0

        let growth = 0
        if (previous > 0) {
            growth = ((current - previous) / previous) * 100
        }

        return {
            revenue: {
                users: userCount,
                buses: busCount,
                tripCount: tripCount,
                ticketCount: ticketCount,
                revenue: todayRevenue,
                thisMonth: current,
                lastMonth: previous,
                growthPercent: growth
            }
        }
    }
}

module.exports = dashboardService