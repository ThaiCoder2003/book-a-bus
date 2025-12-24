const prisma = require('../configs/db');
const { getAll } = require('../controllers/seatController');

const userService = {
    getAllUsers: async () => {
        return await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
                // Không trả về passwordHash để bảo mật
            },
        });
    },

    getProfile: async (req, res) => {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
                // Không trả về passwordHash để bảo mật
            },
        });
    },

    editProfile: async (userId, profileData) => {
        // Lọc bỏ các trường bị undefined hoặc rỗng để tránh ghi đè dữ liệu rác
        const dataUpdate = {};
        if (profileData.name?.trim()) dataUpdate.name = profileData.name.trim();
        if (profileData.email?.trim()) dataUpdate.email = profileData.email.trim();
        if (profileData.phone?.trim()) dataUpdate.phone = profileData.phone.trim();

        return await prisma.user.update({
            where: { id: userId },
            data: dataUpdate, // Truyền object đã lọc
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true,
            },
        });
    },

    statOverview: async (userId) => {
        const totalBookings = await prisma.booking.count({
            where: { userId },
        });

        const totalSpentAgg = await prisma.booking.aggregate({
            where: {
                userId,
                status: 'CONFIRMED', // Chỉ tính các booking đã hoàn tất
            },
            _sum: {
                totalAmount: true,
            },
        });

        return {
            totalBookings,
            totalSpent: Number(totalSpentAgg._sum.totalAmount) || 0,
        };
    },

    nextTrip: async (userId) => {
        const nextBooking = await prisma.booking.findFirst({
            where: {
            userId: userId,
            status: 'CONFIRMED',
            trip: {
                departureTime: {
                gt: new Date(), // Chỉ lấy các chuyến trong tương lai
                },
            },
            },
            include: {
            trip: {
                include: {
                bus: true,   // Lấy biển số xe, loại xe
                route: true, // Lấy tên tuyến đường
                },
            },
            departureStation: true, // Điểm đi
            arrivalStation: true,   // Điểm đến
            tickets: {
                include: {
                seat: true, // Lấy số ghế (label)
                },
            },
            },
            orderBy: {
            trip: {
                departureTime: 'asc', // Chuyến gần nhất sẽ lên đầu
            },
            },
        });

        if (!nextBooking) {
            return null; // Không có chuyến tiếp theo
        }

        return {
            bookingId: nextBooking.id,
            ticketCode: nextBooking.id.split('-')[0].toUpperCase(), // Giả lập mã vé ngắn
            departure: nextBooking.departureStation.name,
            departureProvince: nextBooking.departureStation.province,
            arrival: nextBooking.arrivalStation.name,
            arrivalProvince: nextBooking.arrivalStation.province,
            departureTime: nextBooking.trip.departureTime,
            busPlate: nextBooking.trip.bus.plateNumber,
            busType: nextBooking.trip.bus.name,
            seats: nextBooking.tickets.map(t => t.seat.label).join(', '),
        };
    },

    bookingHistory: async (userId) => {
        const bookings = await prisma.booking.findMany({
            where: { 
                userId: userId 
            },
            include: {
            departureStation: true,
            arrivalStation: true,
            trip: true,
            },
            orderBy: {
            createdAt: 'desc', // Đặt vé mới nhất hiện lên trước
            },
        });

        // Chuyển đổi dữ liệu sang format mà UI của bạn đang dùng
        return bookings.map((b) => ({
            id: b.id,
            date: new Date(b.trip.departureTime).toLocaleDateString('vi-VN'),
            route: `${b.departureStation.province} → ${b.arrivalStation.province}`,
            status: b.status === 'CONFIRMED' ? 'Hoàn thành' : 
                    b.status === 'CANCELLED' ? 'Đã hủy' : 'Đang chờ',
            price: new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
            }).format(Number(b.totalAmount)),
        }));
    },
}

module.exports = userService