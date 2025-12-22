import {
    PrismaClient,
    SeatType,
    Role,
    BookingStatus,
    Prisma,
} from '@prisma/client'
import * as bcrypt from 'bcrypt' // Cần cài: npm install bcrypt @types/bcrypt

const prisma = new PrismaClient()

// Hàm tạo ghế tự động cho xe
const generateSeats = (
    busId: string,
    type: SeatType,
    totalSeats: number,
    floors: number = 2,
) => {
    const seats = []
    const seatsPerFloor = Math.ceil(totalSeats / floors)
    const rows = Math.ceil(seatsPerFloor / 3) // Giả sử 3 dãy (col)

    let seatCount = 0

    for (let floor = 1; floor <= floors; floor++) {
        for (let row = 1; row <= rows; row++) {
            for (let col = 1; col <= 3; col++) {
                if (seatCount >= totalSeats) break
                seatCount++

                // Label ghế: A01, A02 (Tầng 1) - B01, B02 (Tầng 2)
                const floorLabel = floor === 1 ? 'A' : 'B'
                const seatLabel = `${floorLabel}${row
                    .toString()
                    .padStart(2, '0')}${col}`

                // Logic: Tầng 1 là VIP/Double, Tầng 2 là Single/Seat
                let specificType = type
                if (type === SeatType.VIP && floor === 2)
                    specificType = SeatType.SINGLE_BED

                seats.push({
                    busId,
                    label: seatLabel,
                    floor,
                    row,
                    col,
                    type: specificType,
                })
            }
        }
    }
    return seats
}

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Clean Database (Xóa dữ liệu cũ theo thứ tự quan hệ)
    await prisma.ticket.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.trip.deleteMany()
    await prisma.route_Station.deleteMany()
    await prisma.route.deleteMany()
    await prisma.seat.deleteMany()
    await prisma.bus.deleteMany()
    await prisma.station.deleteMany()
    await prisma.user.deleteMany()

    console.log('🧹 Database cleaned.')

    // 2. Create Users
    const passwordHash = await bcrypt.hash('123456', 10)

    const admin = await prisma.user.create({
        data: {
            email: 'admin@bus.com',
            name: 'Admin System',
            passwordHash,
            phone: '0900000000',
            role: Role.ADMIN,
        },
    })

    const user1 = await prisma.user.create({
        data: {
            email: 'khachhang@gmail.com',
            name: 'Nguyễn Văn A',
            passwordHash,
            phone: '0911111111',
            role: Role.USER,
        },
    })

    console.log('👤 Users created.')

    // 3. Create Stations
    const stationData = [
        {
            name: 'Bến xe Miền Đông',
            address: 'Bình Thạnh',
            province: 'Hồ Chí Minh',
        },
        { name: 'Trạm Đồng Nai', address: 'Biên Hòa', province: 'Đồng Nai' },
        { name: 'Trạm Bảo Lộc', address: 'Bảo Lộc', province: 'Lâm Đồng' },
        {
            name: 'Bến xe Liên Tỉnh Đà Lạt',
            address: 'Đà Lạt',
            province: 'Lâm Đồng',
        },
        {
            name: 'Bến xe Phía Nam Nha Trang',
            address: 'Nha Trang',
            province: 'Khánh Hòa',
        },
        {
            name: 'Bến xe Trung Tâm Đà Nẵng',
            address: 'Đà Nẵng',
            province: 'Đà Nẵng',
        },
    ]

    // Lưu lại map station để dùng ID sau này
    const stations: Record<string, string> = {}

    for (const s of stationData) {
        const created = await prisma.station.create({ data: s })
        stations[s.province] = created.id // Key theo tỉnh cho dễ lấy
        // Lưu thêm key theo tên nếu cần
        if (s.name.includes('Miền Đông')) stations['HCM'] = created.id
        if (s.name.includes('Nha Trang')) stations['Nha Trang'] = created.id
        if (s.name.includes('Đà Nẵng')) stations['Đà Nẵng'] = created.id
        if (s.name.includes('Đà Lạt')) stations['Đà Lạt'] = created.id
        if (s.name.includes('Đồng Nai')) stations['Đồng Nai'] = created.id
        if (s.name.includes('Bảo Lộc')) stations['Bảo Lộc'] = created.id
    }

    console.log('stations created', stations)

    // 4. Create Buses & Seats
    const busData = [
        {
            plateNumber: '51B-123.45',
            name: 'Phương Trang Limousine',
            totalSeats: 34,
            type: SeatType.VIP,
        },
        {
            plateNumber: '51B-678.90',
            name: 'Thành Bưởi Sleeper',
            totalSeats: 40,
            type: SeatType.SINGLE_BED,
        },
        {
            plateNumber: '29B-999.99',
            name: 'Hà Sơn Hải Vân Royal',
            totalSeats: 22,
            type: SeatType.DOUBLE_BED,
        },
    ]

    const busIds: string[] = []

    for (const b of busData) {
        const bus = await prisma.bus.create({
            data: {
                plateNumber: b.plateNumber,
                name: b.name,
                totalSeats: b.totalSeats,
            },
        })
        busIds.push(bus.id)

        // Tạo ghế
        const seats = generateSeats(bus.id, b.type, b.totalSeats)
        await prisma.seat.createMany({ data: seats })
    }

    console.log('🚌 Buses & Seats created.')

    // 5. Create Routes (Tuyến đường) & Route_Station
    // Tuyến 1: HCM -> Đà Lạt
    const routeDL = await prisma.route.create({
        data: { name: 'Sài Gòn - Đà Lạt' },
    })

    await prisma.route_Station.createMany({
        data: [
            {
                routeId: routeDL.id,
                stationId: stations['HCM'],
                order: 1,
                durationFromStart: 0,
                distanceFromStart: 0,
                priceFromStart: 0,
            },
            {
                routeId: routeDL.id,
                stationId: stations['Đồng Nai'],
                order: 2,
                durationFromStart: 60,
                distanceFromStart: 30,
                priceFromStart: 50000,
            },
            {
                routeId: routeDL.id,
                stationId: stations['Bảo Lộc'],
                order: 3,
                durationFromStart: 240,
                distanceFromStart: 180,
                priceFromStart: 150000,
            },
            {
                routeId: routeDL.id,
                stationId: stations['Đà Lạt'],
                order: 4,
                durationFromStart: 420,
                distanceFromStart: 300,
                priceFromStart: 300000,
            },
        ],
    })

    // Tuyến 2: HCM -> Nha Trang
    const routeNT = await prisma.route.create({
        data: { name: 'Sài Gòn - Nha Trang' },
    })

    await prisma.route_Station.createMany({
        data: [
            {
                routeId: routeNT.id,
                stationId: stations['HCM'],
                order: 1,
                durationFromStart: 0,
                distanceFromStart: 0,
                priceFromStart: 0,
            },
            {
                routeId: routeNT.id,
                stationId: stations['Đồng Nai'],
                order: 2,
                durationFromStart: 60,
                distanceFromStart: 30,
                priceFromStart: 50000,
            },
            {
                routeId: routeNT.id,
                stationId: stations['Nha Trang'],
                order: 3,
                durationFromStart: 480,
                distanceFromStart: 430,
                priceFromStart: 450000,
            },
        ],
    })

    console.log('🛣️ Routes created.')

    // 6. Create Trips (Chuyến đi)
    // Tạo chuyến đi cho 30 ngày tới
    const tripIds: string[] = []
    const today = new Date()

    // Khung giờ chạy: 8h sáng, 13h chiều, 22h tối
    const departureHours = [8, 13, 22]

    for (let i = 0; i < 30; i++) {
        const currentDate = new Date(today)
        currentDate.setDate(today.getDate() + i)

        for (const hour of departureHours) {
            // Set giờ
            const departureTime = new Date(currentDate)
            departureTime.setHours(hour, 0, 0, 0)

            // Chuyến đi Đà Lạt
            const trip1 = await prisma.trip.create({
                data: {
                    busId: busIds[Math.floor(Math.random() * busIds.length)], // Random bus
                    routeId: routeDL.id,
                    departureTime: departureTime,
                },
            })
            tripIds.push(trip1.id)

            // Chuyến đi Nha Trang
            const trip2 = await prisma.trip.create({
                data: {
                    busId: busIds[Math.floor(Math.random() * busIds.length)], // Random bus
                    routeId: routeNT.id,
                    departureTime: departureTime,
                },
            })
            tripIds.push(trip2.id)
        }
    }

    console.log('📅 Trips created for next 30 days.')

    // 7. Create Bookings (Giả lập đặt vé)
    // Đặt vé cho chuyến đầu tiên của Đà Lạt
    const firstTrip = await prisma.trip.findFirst({
        where: { routeId: routeDL.id },
        include: { bus: { include: { seats: true } } },
    })

    if (firstTrip && firstTrip.bus.seats.length > 0) {
        // Giả sử khách đi full tuyến HCM -> Đà Lạt
        const ticketPrice = 300000

        // Tạo Booking
        const booking = await prisma.booking.create({
            data: {
                userId: user1.id,
                tripId: firstTrip.id,
                status: BookingStatus.CONFIRMED,
                totalAmount: ticketPrice * 2, // Mua 2 vé
                departureStationId: stations['HCM'],
                arrivalStationId: stations['Đà Lạt'],
                tickets: {
                    create: [
                        {
                            seatId: firstTrip.bus.seats[0].id, // Ghế A01
                            tripId: firstTrip.id,
                            fromOrder: 1,
                            toOrder: 4,
                        },
                        {
                            seatId: firstTrip.bus.seats[1].id, // Ghế A02
                            tripId: firstTrip.id,
                            fromOrder: 1,
                            toOrder: 4,
                        },
                    ],
                },
            },
        })
        console.log(`🎫 Booking created: ${booking.id}`)
    }

    console.log('✅ Seed completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
