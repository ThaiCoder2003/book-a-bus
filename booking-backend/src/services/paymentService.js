const axios = require('axios')
const crypto = require('crypto')
const moment = require('moment')
const prisma = require('../configs/db')
const { BookingStatus } = require('@prisma/client')

// Destructuring environment variables
const {
    ZALOPAY_APP_ID,
    ZALOPAY_KEY1,
    ZALOPAY_KEY2,
    ZALOPAY_ENDPOINT,
    ZALOPAY_CALLBACK_URL,
    FRONTEND_URL,
} = process.env

const paymentService = {
    createZaloPayPayment: async ({ bookingId }) => {
        // 1. Lấy thông tin Booking & Validate
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
        })

        if (!booking) {
            throw new Error('Không tìm thấy đơn đặt chỗ')
        }

        if (booking.status === BookingStatus.CONFIRMED) {
            throw new Error('Đơn hàng này đã được thanh toán trước đó')
        }

        const amount = Math.round(Number(booking.totalAmount))

        // 2. Tạo mã giao dịch (app_trans_id)
        // FORMAT: YYMMDD_xxxx (Giới hạn ký tự của ZaloPay, không dùng UUID ở đây)
        const dateStr = moment().format('YYMMDD')
        const transID = Math.floor(Math.random() * 1000000) // Số ngẫu nhiên nhỏ
        const appTransId = `${dateStr}_${transID}`

        // 3. Update appTransId vào DB (Cực kỳ quan trọng để mapping khi callback)
        await prisma.booking.update({
            where: { id: bookingId },
            data: { paymentRef: appTransId },
        })

        // 4. Cấu hình Embed Data & Items
        const embed_data = {
            // Redirect về trang PaymentPage để frontend tự check status
            redirecturl: `${FRONTEND_URL}/payment/${bookingId}`,
        }

        const items = [
            {
                bookingId,
                name: `Booking #${bookingId}`,
                price: amount,
            },
        ]

        // 5. Tạo payload gửi ZaloPay
        const order = {
            app_id: parseInt(ZALOPAY_APP_ID),
            app_trans_id: appTransId,
            app_user: `${booking.userId}`,
            app_time: Date.now(), // milliseconds
            item: JSON.stringify(items),
            embed_data: JSON.stringify(embed_data),
            amount: amount,
            description: `Thanh toan ve xe #${bookingId.slice(0, 8)}...`,
            bank_code: '',
            callback_url: ZALOPAY_CALLBACK_URL,
            mac: '',
        }

        // 6. Tạo chữ ký MAC (HMAC-SHA256)
        // Chuỗi dữ liệu: app_id|app_trans_id|app_user|amount|app_time|embed_data|item
        const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`

        order.mac = crypto
            .createHmac('sha256', ZALOPAY_KEY1)
            .update(data)
            .digest('hex')

        // 7. Gọi API ZaloPay
        try {
            console.log('ZaloPay Request:', order) // Log để debug nếu cần

            const response = await axios.post(ZALOPAY_ENDPOINT, null, {
                params: order,
            })

            console.log('ZaloPay Response:', response.data)

            if (response.data.return_code !== 1) {
                throw new Error(
                    `ZaloPay Error: ${response.data.return_message} (${response.data.sub_return_message})`,
                )
            }

            return {
                ...response.data,
                app_trans_id: appTransId,
            }
        } catch (err) {
            // Log chi tiết lỗi từ Axios nếu có
            if (err.response) {
                console.error('ZaloPay API Error:', err.response.data)
            }
            throw new Error(err.message)
        }
    },

    handleZaloPayCallback: async (dataStr, reqMac) => {
        const result = {}

        try {
            // 1. Kiểm tra chữ ký (Quan trọng: Dùng KEY2)
            const mac = crypto
                .createHmac('sha256', ZALOPAY_KEY2)
                .update(dataStr)
                .digest('hex')

            // Kiểm tra tính hợp lệ của callback (Chống giả mạo request)
            if (reqMac !== mac) {
                result.return_code = -1
                result.return_message = 'mac not equal'
            } else {
                // 2. Parse dữ liệu
                const dataJson = JSON.parse(dataStr)
                const { app_trans_id } = dataJson

                console.log(`Callback received for TransID: ${app_trans_id}`)

                // 3. Tìm đơn hàng trong DB
                const booking = await prisma.booking.findFirst({
                    where: { paymentRef: app_trans_id },
                })

                if (!booking) {
                    result.return_code = 0 // ZaloPay sẽ không gọi lại nếu trả về 1, trả về 0 nếu muốn họ retry (tùy logic, thường not found thì thôi)
                    result.return_message = 'Booking not found'
                } else {
                    // 4. Kiểm tra Idempotency (Tránh xử lý 2 lần)
                    if (booking.status === BookingStatus.CONFIRMED) {
                        result.return_code = 1
                        result.return_message = 'Already processed'
                    } else {
                        // 5. Cập nhật trạng thái thành công
                        await prisma.booking.update({
                            where: { id: booking.id },
                            data: {
                                status: BookingStatus.CONFIRMED,
                                paymentTime: new Date(),
                                // Có thể lưu thêm paymentMethod: 'ZALOPAY'
                            },
                        })

                        result.return_code = 1
                        result.return_message = 'Success'
                    }
                }
            }
        } catch (error) {
            console.error('ZaloPay Callback Exception:', error)
            result.return_code = 0 // Báo lỗi để ZaloPay gọi lại sau
            result.return_message = error.message
        }

        return result
    },
}

module.exports = paymentService
