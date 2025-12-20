import { PrismaClient, SeatType, BookingStatus, Prisma } from '@prisma/client'
import { fakerVI as faker } from '@faker-js/faker' // Dùng locale Việt Nam

const prisma = new PrismaClient()

// Hàm tiện ích để lấy ngẫu nhiên một phần tử trong mảng
const randomElement = <T>(array: T[]): T =>
    array[Math.floor(Math.random() * array.length)]

// Hàm tạo số ngẫu nhiên trong khoảng
const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

async function main() {
    console.log('🌱 Bắt đầu seed dữ liệu...')

    // 1. Xóa dữ liệu cũ (theo thứ tự để tránh lỗi khóa ngoại)
    // Xóa bảng con trước, bảng cha sau
    await prisma.ticket.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.trip.deleteMany()
    await prisma.seat.deleteMany()
    await prisma.bus.deleteMany()
    await prisma.station.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️  Đã xóa dữ liệu cũ.')

    // -------------------------------------------------------
    // 2. Tạo Users (50 người)
    // -------------------------------------------------------
    const usersData = Array.from({ length: 50 }).map(() => ({
        email: faker.internet.email(),
        name: faker.person.fullName(),
        // Giả lập hash password (trong thực tế dùng bcrypt)
        passwordHash: '$2b$10$EpOdNfQz.1/6N.m1.U8.1.y8.1.y8.1.y8.1.y8.1',
        phone: faker.phone.number(),
        role: randomElement(['user', 'user', 'user', 'admin']), // Tỉ lệ user nhiều hơn
    }))

    await prisma.user.createMany({ data: usersData })
    const users = await prisma.user.findMany()
    console.log(`👤 Đã tạo ${users.length} users.`)

    // -------------------------------------------------------
    // 3. Tạo Stations (Các bến xe)
    // -------------------------------------------------------
    const stationsList = [
        { name: 'Bến xe Mỹ Đình', province: 'Hà Nội', address: '20 Phạm Hùng' },
        { name: 'Bến xe Giáp Bát', province: 'Hà Nội', address: 'Giải Phóng' },
        {
            name: 'Bến xe Miền Tây',
            province: 'Hồ Chí Minh',
            address: '395 Kinh Dương Vương',
        },
        {
            name: 'Bến xe Miền Đông',
            province: 'Hồ Chí Minh',
            address: 'Đinh Bộ Lĩnh',
        },
        {
            name: 'Bến xe Đà Nẵng',
            province: 'Đà Nẵng',
            address: 'Tôn Đức Thắng',
        },
        { name: 'Bến xe Đức Long', province: 'Lâm Đồng', address: 'Đà Lạt' },
        {
            name: 'Bến xe Cần Thơ',
            province: 'Cần Thơ',
            address: 'Nguyễn Văn Linh',
        },
    ]

    await prisma.station.createMany({ data: stationsList })
    const stations = await prisma.station.findMany()
    console.log(`ea Đã tạo ${stations.length} bến xe.`)

    // -------------------------------------------------------
    // 4. Tạo Buses và Seats
    // -------------------------------------------------------
    const busTypes: SeatType[] = ['SINGLE_BED', 'DOUBLE_BED', 'SEAT']
    const busesData = []

    // Tạo 15 xe
    for (let i = 0; i < 15; i++) {
        const type = randomElement(busTypes)
        const plateNumber = `${randomInt(29, 99)}${randomElement([
            'A',
            'B',
            'C',
            'F',
        ])}-${randomInt(10000, 99999)}`

        // Logic tạo ghế dựa trên loại xe
        let totalSeats = 0
        const seatsCreateInput: Prisma.SeatCreateWithoutBusInput[] = []

        // Cấu hình giả lập: 2 tầng, 3 dãy, 5-6 hàng
        const floors = type === 'SEAT' ? 1 : 2
        const rows = type === 'DOUBLE_BED' ? 5 : 6
        const cols = 3

        for (let f = 1; f <= floors; f++) {
            for (let r = 1; r <= rows; r++) {
                for (let c = 1; c <= cols; c++) {
                    totalSeats++
                    // Label ví dụ: A01, A02... hoặc Tầng 1-A-01
                    const label = `${f === 1 ? 'A' : 'B'}${r}${c}`
                    seatsCreateInput.push({
                        label: label,
                        floor: f,
                        row: r,
                        col: c,
                        isActive: true,
                    })
                }
            }
        }

        // Tạo xe và ghế cùng lúc
        const bus = await prisma.bus.create({
            data: {
                plateNumber,
                name: `Nhà xe ${faker.company.name()}`,
                type,
                totalSeats,
                seats: {
                    create: seatsCreateInput,
                },
            },
        })
        busesData.push(bus)
    }
    console.log(`🚌 Đã tạo ${busesData.length} xe buýt và các ghế tương ứng.`)

    // -------------------------------------------------------
    // 5. Tạo Trips (50 chuyến)
    // -------------------------------------------------------
    // Lấy danh sách ID để random
    const allBusIds = busesData.map((b) => b.id)
    const allStationIds = stations.map((s) => s.id)

    const tripsCreated = []

    for (let i = 0; i < 50; i++) {
        const originId = randomElement(allStationIds)
        // Đảm bảo điểm đến khác điểm đi
        let destId = randomElement(allStationIds)
        while (destId === originId) {
            destId = randomElement(allStationIds)
        }

        const departureDate = faker.date.soon({ days: 30 }) // Trong vòng 30 ngày tới
        const durationHours = randomInt(4, 12)
        const arrivalDate = new Date(
            departureDate.getTime() + durationHours * 60 * 60 * 1000,
        )

        const trip = await prisma.trip.create({
            data: {
                busId: randomElement(allBusIds),
                originStationId: originId,
                destStationId: destId,
                departureTime: departureDate,
                arrivalTime: arrivalDate,
                basePrice: new Prisma.Decimal(
                    randomElement([200000, 350000, 500000, 800000]),
                ),
            },
        })
        tripsCreated.push(trip)
    }
    console.log(`🛣️  Đã tạo ${tripsCreated.length} chuyến đi.`)

    // -------------------------------------------------------
    // 6. Tạo Bookings và Tickets (Giả lập đặt vé)
    // -------------------------------------------------------
    // Duyệt qua từng chuyến đi
    for (const trip of tripsCreated) {
        // Random xem chuyến này có bao nhiêu người đặt (từ 0 đến 5 booking)
        const numberOfBookings = randomInt(0, 5)

        // Lấy danh sách ghế của xe chạy chuyến này
        const busSeats = await prisma.seat.findMany({
            where: { busId: trip.busId },
        })

        // Shuffle ghế để chọn ngẫu nhiên không trùng nhau trong chuyến này
        const availableSeats = [...busSeats].sort(() => 0.5 - Math.random())

        for (let b = 0; b < numberOfBookings; b++) {
            if (availableSeats.length === 0) break

            const user = randomElement(users)
            const seatsCountToBook = randomInt(1, 3) // Mỗi booking đặt 1-3 vé

            const seatsForThisBooking = []
            for (let k = 0; k < seatsCountToBook; k++) {
                if (availableSeats.length > 0) {
                    seatsForThisBooking.push(availableSeats.pop()!) // Lấy ghế ra khỏi ds available
                }
            }

            if (seatsForThisBooking.length === 0) continue

            const totalAmount =
                Number(trip.basePrice) * seatsForThisBooking.length

            // Tạo Booking
            const booking = await prisma.booking.create({
                data: {
                    tripId: trip.id,
                    userId: user.id,
                    userName: user.name,
                    userPhone: user.phone,
                    totalAmount: new Prisma.Decimal(totalAmount),
                    status: randomElement([
                        BookingStatus.CONFIRMED,
                        BookingStatus.PENDING,
                        BookingStatus.CONFIRMED,
                    ]), // Ưu tiên Confirmed
                    tickets: {
                        create: seatsForThisBooking.map((seat) => ({
                            tripId: trip.id,
                            seatId: seat.id,
                            price: trip.basePrice,
                            passengerName: user.name, // Giả sử người đặt đi luôn
                            passengerPhone: user.phone,
                        })),
                    },
                },
            })
        }
    }
    console.log(`Ez Đã tạo xong bookings và tickets.`)

    console.log('✅ SEEDING HOÀN TẤT!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
