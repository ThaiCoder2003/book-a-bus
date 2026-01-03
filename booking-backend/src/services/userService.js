const prisma = require('../configs/db');
const bcrypt = require('bcrypt')

const userService = {
    getAllUsers: async (query, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        const [users, total] = await prisma.$transaction([
            prisma.user.findMany({
                where: query ? 
                {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                        { phone: { contains: query, mode: 'insensitive' } }
                    ],
                }  : {},
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    name: true,
                    phone: true,
                    role: true,
                    createdAt: true,
                    bookings: {
                        select: {
                            totalAmount: true
                        }
                    },
                    _count: {
                        select: {
                            bookings: true
                        }
                    }
                },
            }),

            prisma.user.count()
        ]);

        const usersWithTotalspend = users.map(user => {
            const totalSpent = user.bookings.reduce((sum, booking) => {
                return sum + (Number(booking.totalAmount) || 0);
            }, 0);

            const orders = user._count?.bookings || 0

            const { bookings, _count, ...userWithoutBookings } = user;
            
            return {
                ...userWithoutBookings,
                totalSpent,
                orders
            };
        });

        return {
            users: usersWithTotalspend,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            },
            total
        }
    },

    getProfile: async (userId) => {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    include: {
                        trip: {
                            include: {
                                bus: true
                            }
                        },

                        arrivalStation: true,
                        departureStation: true,
                        
                    },
                },

                _count: {
                    select: {
                        bookings: true
                    }
                }
                // Không trả về passwordHash để bảo mật
            },
        });

        const totalSpent = user.bookings.reduce((sum, booking) => {
            return sum + (Number(booking.totalAmount) || 0);
        }, 0);

        const orders = user._count?.bookings || 0

        const { _count, ...userWithoutCount } = user;
        
        return {
            ...userWithoutCount,
            totalSpent,
            orders
        };
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
                        gt: new Date(), // Lấy chuyến trong tương lai
                    },
                },
            },
            include: {
                trip: {
                    include: {
                        bus: true,
                        route: true,
                    },
                },
                departureStation: true, // Quan hệ BookingDep
                arrivalStation: true,   // Quan hệ BookingArr
                tickets: {
                    include: {
                        seat: true,
                    },
                },
            },
            orderBy: {
                trip: {
                    departureTime: 'asc',
                },
            },
        });

        if (!nextBooking) return null;

        // Tính toán hiển thị
        const depTime = new Date(nextBooking.trip.departureTime);

        return {
            bookingId: nextBooking.id,
            // Mã vé lấy 8 ký tự đầu của UUID cho gọn
            ticketCode: nextBooking.id.split('-')[0].toUpperCase(), 
            
            // Địa điểm (Lấy từ model Station qua relation BookingDep/Arr)
            departure: nextBooking.departureStation.name,
            departureProvince: nextBooking.departureStation.province,
            arrival: nextBooking.arrivalStation.name,
            arrivalProvince: nextBooking.arrivalStation.province,
            
            // Thời gian
            departureTime: depTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            departureDate: depTime.toLocaleDateString('vi-VN'),
            
            // Xe & Ghế
            busPlate: nextBooking.trip.bus.plateNumber,
            busType: nextBooking.trip.bus.name,
            // Map qua mảng tickets để lấy label của từng ghế
            seats: nextBooking.tickets.map(t => t.seat.label).join(', '),
            
            // Tổng tiền (Decimal trong Prisma cần ép kiểu Number)
            totalAmount: Number(nextBooking.totalAmount)
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

    resetPassword: async (userId, newRawPassword) => {
    // 1. Tạo salt và hash mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newRawPassword, salt);

        // 2. Cập nhật vào DB
        return await prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: passwordHash, // Lưu chuỗi đã mã hóa
                // requirePasswordChange: true (Nếu bạn có field này)
            }
        });
    }
}

module.exports = userService