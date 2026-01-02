import {
    PrismaClient,
    SeatType,
    Role,
    BookingStatus,
    Prisma,
} from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// --- HELPERS ---
const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min
const getRandomElement = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)]

async function main() {
    console.log('🌱 Starting seeding process...')

    // 1. CLEANUP DATABASE
    // Xóa theo thứ tự ngược lại của quan hệ để tránh lỗi khóa ngoại
    console.log('🧹 Cleaning up database...')
    await prisma.ticket.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.trip.deleteMany()
    await prisma.route_Station.deleteMany()
    await prisma.route.deleteMany()
    await prisma.seat.deleteMany()
    await prisma.bus.deleteMany()
    await prisma.station.deleteMany()
    await prisma.user.deleteMany()

    // 2. SEED USERS
    console.log('👤 Seeding users...')
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash('Password123!', salt) // Mật khẩu chung

    const usersData: Prisma.UserCreateInput[] = []

    // Tạo 2 Admin
    usersData.push(
        {
            email: 'admin@system.com',
            name: 'Super Admin',
            passwordHash,
            phone: '0900000001',
            role: Role.ADMIN,
        },
        {
            email: 'manager@bus.com',
            name: 'Manager Bob',
            passwordHash,
            phone: '0900000002',
            role: Role.ADMIN,
        },
    )

    // Tạo 48 Users thường
    for (let i = 1; i <= 48; i++) {
        usersData.push({
            email: `user${i}@example.com`,
            name: `Customer User ${i}`,
            passwordHash,
            phone: `09${getRandomInt(10000000, 99999999)}`,
            role: Role.USER,
        })
    }

    // Dùng transaction để tạo nhanh
    await prisma.$transaction(
        usersData.map((user) => prisma.user.create({ data: user })),
    )
    const allUsers = await prisma.user.findMany() // Lấy lại user để dùng cho booking sau này

    // 3. SEED STATIONS
    console.log('🚏 Seeding stations...')
    const stationList = [
        { name: 'Bến xe Mỹ Đình', address: '20 Phạm Hùng', province: 'Hà Nội' },
        { name: 'Bến xe Giáp Bát', address: 'Giải Phóng', province: 'Hà Nội' },
        { name: 'Bến xe Nước Ngầm', address: 'Hoàng Mai', province: 'Hà Nội' },
        {
            name: 'Bến xe Trung Tâm Đà Nẵng',
            address: 'Tôn Đức Thắng',
            province: 'Đà Nẵng',
        },
        {
            name: 'Bến xe Phía Nam',
            address: 'Vĩnh Trung',
            province: 'Nha Trang',
        },
        { name: 'Bến xe Liên Tỉnh', address: 'Đường 1/4', province: 'Đà Lạt' },
        {
            name: 'Bến xe Miền Đông',
            address: 'Đinh Bộ Lĩnh',
            province: 'Hồ Chí Minh',
        },
        {
            name: 'Bến xe Miền Tây',
            address: 'Kinh Dương Vương',
            province: 'Hồ Chí Minh',
        },
        {
            name: 'Bến xe Cần Thơ',
            address: 'Nguyễn Văn Linh',
            province: 'Cần Thơ',
        },
        {
            name: 'Bến xe Vũng Tàu',
            address: 'Nam Kỳ Khởi Nghĩa',
            province: 'Vũng Tàu',
        },
    ]

    const createdStations = []
    for (const s of stationList) {
        createdStations.push(await prisma.station.create({ data: s }))
    }

    // 4. SEED BUSES & SEATS
    console.log('🚌 Seeding buses and seats...')
    const busModels = [
        { name: 'Thaco Mobihome Luxury', seats: 34 },
        { name: 'Hyundai Universe', seats: 40 },
        { name: 'Limousine Palace', seats: 22 },
    ]

    const buses = []
    for (let i = 1; i <= 10; i++) {
        const model = getRandomElement(busModels)
        // Tạo Bus
        const bus = await prisma.bus.create({
            data: {
                name: model.name,
                plateNumber: `59B-${getRandomInt(100, 999)}.${getRandomInt(
                    10,
                    99,
                )}`, // Biển số ngẫu nhiên
                totalSeats: model.seats,
            },
        })
        buses.push(bus)

        // Tạo Seats cho Bus này
        const seatsData = []
        const floors = 2
        const rows = Math.ceil(model.seats / 6) // Ước lượng số hàng
        const cols = 3

        let seatCount = 0
        for (let f = 1; f <= floors; f++) {
            for (let r = 1; r <= rows; r++) {
                for (let c = 1; c <= cols; c++) {
                    if (seatCount >= model.seats) break

                    // Logic loại ghế
                    let type = SeatType.SINGLE_BED
                    if (model.seats === 22)
                        type = SeatType.VIP // Limousine toàn VIP
                    else if (r <= 2) type = SeatType.VIP // Xe thường thì 2 hàng đầu VIP

                    const colLabel = c === 1 ? 'A' : c === 2 ? 'B' : 'C'
                    const floorPrefix = f === 1 ? 'A' : 'B' // Tầng 1 là A.., Tầng 2 là B..
                    const label = `${floorPrefix}${r
                        .toString()
                        .padStart(2, '0')}${colLabel}`

                    seatsData.push({
                        busId: bus.id,
                        label,
                        floor: f,
                        row: r,
                        col: c,
                        type,
                    })
                    seatCount++
                }
            }
        }
        await prisma.seat.createMany({ data: seatsData })
    }

    // 5. SEED ROUTES & ROUTE_STATIONS
    console.log('🛣️ Seeding routes...')

    // Định nghĩa các tuyến đường
    // Helper tìm station id theo tên (giả sử tên unique trong seed này)
    const getStationId = (name: string) =>
        createdStations.find((s) => s.name === name)?.id || ''

    const routesConfig = [
        {
            name: 'Hà Nội - Hồ Chí Minh (QL1A)',
            stops: [
                { name: 'Bến xe Nước Ngầm', dist: 0, price: 0, dur: 0 },
                {
                    name: 'Bến xe Trung Tâm Đà Nẵng',
                    dist: 760,
                    price: 450000,
                    dur: 840,
                },
                {
                    name: 'Bến xe Phía Nam',
                    dist: 1280,
                    price: 700000,
                    dur: 1200,
                },
                {
                    name: 'Bến xe Miền Đông',
                    dist: 1720,
                    price: 950000,
                    dur: 1800,
                },
            ],
        },
        {
            name: 'Hồ Chí Minh - Đà Lạt',
            stops: [
                { name: 'Bến xe Miền Đông', dist: 0, price: 0, dur: 0 },
                {
                    name: 'Bến xe Liên Tỉnh',
                    dist: 300,
                    price: 280000,
                    dur: 360,
                },
            ],
        },
        {
            name: 'Hồ Chí Minh - Cần Thơ',
            stops: [
                { name: 'Bến xe Miền Tây', dist: 0, price: 0, dur: 0 },
                { name: 'Bến xe Cần Thơ', dist: 170, price: 160000, dur: 240 },
            ],
        },
        {
            name: 'Hồ Chí Minh - Vũng Tàu',
            stops: [
                { name: 'Bến xe Miền Đông', dist: 0, price: 0, dur: 0 },
                { name: 'Bến xe Vũng Tàu', dist: 100, price: 120000, dur: 150 },
            ],
        },
    ]

    const createdRoutes = []

    for (const rConfig of routesConfig) {
        const route = await prisma.route.create({
            data: { name: rConfig.name },
        })
        createdRoutes.push(route)

        for (let i = 0; i < rConfig.stops.length; i++) {
            const stop = rConfig.stops[i]
            await prisma.route_Station.create({
                data: {
                    routeId: route.id,
                    stationId: getStationId(stop.name),
                    order: i,
                    distanceFromStart: stop.dist,
                    priceFromStart: stop.price,
                    durationFromStart: stop.dur,
                },
            })
        }
    }

    // 6. SEED TRIPS
    console.log('📅 Seeding trips...')
    const trips = []
    const today = new Date()

    // Tạo trip cho 3 ngày tới
    for (let day = 0; day < 3; day++) {
        const departureDate = new Date(today)
        departureDate.setDate(today.getDate() + day)

        for (const route of createdRoutes) {
            // Mỗi route có 2 chuyến mỗi ngày
            for (let hour of [8, 20]) {
                // 8h sáng và 8h tối
                departureDate.setHours(hour, 0, 0, 0)

                const randomBus = getRandomElement(buses)

                const trip = await prisma.trip.create({
                    data: {
                        busId: randomBus.id,
                        routeId: route.id,
                        departureTime: new Date(departureDate),
                    },
                })
                trips.push(trip)
            }
        }
    }

    // 7. SEED BOOKINGS & TICKETS
    console.log('🎟️ Seeding bookings and tickets...')

    for (const trip of trips) {
        // Lấy thông tin route station của trip này để biết order
        const routeStations = await prisma.route_Station.findMany({
            where: { routeId: trip.routeId },
            orderBy: { order: 'asc' },
            include: { station: true }, // Lấy thông tin station để biết tên/id
        })

        if (routeStations.length < 2) continue

        // Lấy danh sách ghế của xe
        const seats = await prisma.seat.findMany({
            where: { busId: trip.busId },
        })

        // Giả lập 5-10 booking cho mỗi chuyến
        const numberOfBookings = getRandomInt(5, 10)

        // Shuffle ghế để book không trùng nhau (đơn giản hóa)
        const shuffledSeats = seats.sort(() => 0.5 - Math.random())
        let seatIndex = 0

        for (let k = 0; k < numberOfBookings; k++) {
            if (seatIndex >= shuffledSeats.length) break

            const user = getRandomElement(allUsers)

            // Chọn điểm đi và điểm đến ngẫu nhiên trên hành trình
            // Ví dụ: A -> B -> C -> D. Có thể book A->C, B->D, hoặc A->D
            const startIndex = getRandomInt(0, routeStations.length - 2)
            const endIndex = getRandomInt(
                startIndex + 1,
                routeStations.length - 1,
            )

            const startStation = routeStations[startIndex]
            const endStation = routeStations[endIndex]

            // Tính giá vé (đơn giản: giá đến - giá đi)
            const price =
                Number(endStation.priceFromStart) -
                Number(startStation.priceFromStart)

            // Tạo Booking
            const booking = await prisma.booking.create({
                data: {
                    userId: user.id,
                    tripId: trip.id,
                    status: getRandomElement([
                        BookingStatus.CONFIRMED,
                        BookingStatus.PENDING,
                        BookingStatus.CONFIRMED,
                    ]), // Tỉ lệ confirmed cao hơn
                    totalAmount: price,
                    departureStationId: startStation.stationId,
                    arrivalStationId: endStation.stationId,
                    expiredAt: new Date(new Date().getTime() + 15 * 60000), // Hết hạn sau 15p
                },
            })

            // Tạo Ticket (Book 1 ghế)
            const seatToBook = shuffledSeats[seatIndex]
            seatIndex++

            await prisma.ticket.create({
                data: {
                    bookingId: booking.id,
                    seatId: seatToBook.id,
                    tripId: trip.id,
                    fromOrder: startStation.order,
                    toOrder: endStation.order,
                },
            })
        }
    }

    console.log('✅ Seeding completed successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
