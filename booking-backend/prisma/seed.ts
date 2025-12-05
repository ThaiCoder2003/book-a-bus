const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Hàm helper: Chọn ngẫu nhiên 1 phần tử trong mảng
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Hàm helper: Random số nguyên trong khoảng
const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min

async function main() {
    console.log('🌱 Bắt đầu tạo dữ liệu mẫu (Bulk Seeding)...')

    // 1. DỌN DẸP DỮ LIỆU CŨ
    await prisma.ticket.deleteMany()
    await prisma.booking.deleteMany()
    await prisma.trip.deleteMany()
    await prisma.seat.deleteMany()
    await prisma.bus.deleteMany()
    await prisma.station.deleteMany()
    await prisma.user.deleteMany()

    console.log('🗑️ Đã xóa dữ liệu cũ.')

    // 2. TẠO USER
    const passwordHash =
        '$2b$10$EpRnTzVlqHNP0.fKbX9vhumbL/1.N5.G5.G5.G5.G5.G5.G5' // "123456"

    await prisma.user.createMany({
        data: [
            {
                email: 'admin@bus.com',
                name: 'Admin System',
                passwordHash,
                role: 'ADMIN',
            },
            {
                email: 'user@gmail.com',
                name: 'Nguyễn Văn A',
                passwordHash,
                role: 'USER',
            },
            {
                email: 'khach@gmail.com',
                name: 'Trần Thị B',
                passwordHash,
                role: 'USER',
            },
        ],
    })
    console.log('👤 Đã tạo Users.')

    // 3. TẠO DANH SÁCH BẾN XE (STATIONS)
    // Tạo nhiều bến để random cho phong phú
    const stationsData = [
        {
            name: 'Bến xe Miền Đông',
            province: 'Hồ Chí Minh',
            address: '292 Đinh Bộ Lĩnh',
        },
        {
            name: 'Bến xe Miền Tây',
            province: 'Hồ Chí Minh',
            address: '395 Kinh Dương Vương',
        },
        {
            name: 'Bến xe Đà Lạt',
            province: 'Lâm Đồng',
            address: '01 Tô Hiến Thành',
        },
        { name: 'Bến xe Mỹ Đình', province: 'Hà Nội', address: '20 Phạm Hùng' },
        { name: 'Bến xe Giáp Bát', province: 'Hà Nội', address: 'Giải Phóng' },
        { name: 'Bến xe Sapa', province: 'Lào Cai', address: 'Điện Biên Phủ' },
        {
            name: 'Bến xe Đà Nẵng',
            province: 'Đà Nẵng',
            address: 'Tôn Đức Thắng',
        },
        {
            name: 'Bến xe Nha Trang',
            province: 'Khánh Hòa',
            address: 'Đường 23/10',
        },
        {
            name: 'Bến xe Cần Thơ',
            province: 'Cần Thơ',
            address: 'Nguyễn Văn Linh',
        },
        {
            name: 'Bến xe Vũng Tàu',
            province: 'Bà Rịa - Vũng Tàu',
            address: 'Nam Kỳ Khởi Nghĩa',
        },
    ]

    // Dùng createMany không trả về IDs, nên phải dùng create từng cái hoặc findMany lại
    // Ở đây ta dùng loop create để lấy ID ngay
    const stations = []
    for (const s of stationsData) {
        const station = await prisma.station.create({ data: s })
        stations.push(station)
    }
    console.log(`📍 Đã tạo ${stations.length} Bến xe.`)

    // 4. TẠO XE (BUSES) & GHẾ (SEATS)
    const busTypes = [
        { type: 'SINGLE_BED', name: 'Giường Nằm', seats: 34, floors: 2 },
        { type: 'DOUBLE_BED', name: 'Phòng Đôi VIP', seats: 22, floors: 2 },
        { type: 'SEAT', name: 'Ghế Ngồi Limousine', seats: 16, floors: 1 },
        { type: 'SEAT', name: 'Ghế Thường', seats: 40, floors: 1 },
    ]

    const buses = []
    // Tạo khoảng 10 chiếc xe ngẫu nhiên
    for (let i = 1; i <= 10; i++) {
        const randomType = getRandomItem(busTypes)
        const plateNumber = `${getRandomInt(29, 99)}B-${getRandomInt(
            10000,
            99999,
        )}`

        const bus = await prisma.bus.create({
            data: {
                plateNumber: plateNumber,
                name: `Nhà xe ${i} - ${randomType.name}`,
                type: randomType.type,
                totalSeats: randomType.seats,
            },
        })
        buses.push(bus)

        // Tạo ghế cho xe này luôn
        const seatsData = []
        const rows = Math.ceil(randomType.seats / (randomType.floors * 3)) // Ước lượng số hàng

        for (let f = 1; f <= randomType.floors; f++) {
            for (let r = 1; r <= rows; r++) {
                for (let c = 1; c <= 3; c++) {
                    // Giả sử mỗi hàng ngang có 3 ghế
                    if (seatsData.length >= randomType.seats) break // Đủ ghế thì thôi

                    const labelPrefix = f === 1 ? 'A' : 'B'
                    const label = `${labelPrefix}${String(
                        seatsData.length + 1,
                    ).padStart(2, '0')}`

                    seatsData.push({
                        busId: bus.id,
                        label: label,
                        floor: f,
                        row: r,
                        col: c,
                        isActive: true,
                    })
                }
            }
        }
        await prisma.seat.createMany({ data: seatsData })
    }
    console.log(`🚌 Đã tạo ${buses.length} Xe và đầy đủ ghế.`)

    // 5. TẠO 50 CHUYẾN ĐI (TRIPS) NGẪU NHIÊN
    console.log('🚀 Đang tạo 50 chuyến đi ngẫu nhiên...')

    const tripsData = []

    for (let i = 0; i < 50; i++) {
        // Random Bến đi và Bến đến (Đảm bảo khác nhau)
        const origin = getRandomItem(stations)
        let dest = getRandomItem(stations)
        while (dest.id === origin.id) {
            dest = getRandomItem(stations)
        }

        // Random Xe
        const bus = getRandomItem(buses)

        // Random Ngày giờ (Từ hôm nay đến 30 ngày tới)
        const daysToAdd = getRandomInt(0, 30)
        const hour = getRandomItem([7, 9, 13, 19, 22]) // Các khung giờ đẹp
        const minutes = getRandomItem([0, 15, 30, 45])

        const departureTime = new Date()
        departureTime.setDate(departureTime.getDate() + daysToAdd)
        departureTime.setHours(hour, minutes, 0, 0)

        // Random Thời gian di chuyển (4 đến 12 tiếng)
        const durationHours = getRandomInt(4, 12)
        const arrivalTime = new Date(departureTime)
        arrivalTime.setHours(arrivalTime.getHours() + durationHours)

        // Random Giá vé (Dựa theo loại xe)
        let basePrice = 0
        if (bus.type === 'DOUBLE_BED')
            basePrice = getRandomInt(400, 800) * 1000 // 400k - 800k
        else if (bus.type === 'SINGLE_BED')
            basePrice = getRandomInt(250, 450) * 1000 // 250k - 450k
        else basePrice = getRandomInt(100, 250) * 1000 // 100k - 250k

        tripsData.push({
            busId: bus.id,
            originStationId: origin.id,
            destStationId: dest.id,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            basePrice: basePrice,
        })
    }

    // Insert Trips vào DB
    // Dùng createMany cho nhanh (lưu ý createMany không check quan hệ chặt chẽ bằng create nhưng nhanh hơn cho seed)
    await prisma.trip.createMany({
        data: tripsData,
    })

    console.log('✅ SEEDING HOÀN TẤT! Đã tạo xong 50 chuyến xe.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
