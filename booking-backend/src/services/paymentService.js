const axios = require('axios')
const crypto = require('crypto')
const moment = require('moment')
const prisma = require('../configs/db')

const { BookingStatus } = require('@prisma/client')

const {
  ZALOPAY_APP_ID,
  ZALOPAY_KEY1,
  ZALOPAY_KEY2,
  ZALOPAY_ENDPOINT,
  ZALOPAY_CALLBACK_URL
} = process.env

const paymentService = {
createZaloPayPayment: async ({ bookingId, amount }) => {
    const dateStr = moment().format('YYMMDD');
    // Tạo mã giao dịch duy nhất
    const appTransId = `${dateStr}_${bookingId}_${Date.now()}`;

    // 1. Lưu appTransId vào Booking để đối soát sau này
    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentRef: appTransId }
    });

    const order = {
      app_id: parseInt(ZALOPAY_APP_ID),
      app_trans_id: appTransId,
      app_user: 'demo_user',
      app_time: Date.now(),
      item: JSON.stringify([{ bookingId }]),
      embed_data: JSON.stringify({ bookingId }), // Truyền thêm để dự phòng
      amount,
      description: `Thanh toán đặt chỗ #${bookingId}`,
      bank_code: '',
      callback_url: ZALOPAY_CALLBACK_URL
    };

    const data = `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`;

    order.mac = crypto
      .createHmac('sha256', ZALOPAY_KEY1)
      .update(data)
      .digest('hex');

    const response = await axios.post(ZALOPAY_ENDPOINT, order);
    return response.data; // Trả về order_url cho Frontend
  },

handleZaloPayCallback: async (dataStr, mac) => {
    let result = {}; // Khai báo biến result để tránh lỗi

    try {
      const checkMac = crypto
        .createHmac('sha256', ZALOPAY_KEY2)
        .update(dataStr)
        .digest('hex');

      if (mac !== checkMac) {
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        const dataJson = JSON.parse(dataStr);
        const appTransId = dataJson.app_trans_id;

        // Tìm booking tương ứng với mã giao dịch
        const booking = await prisma.booking.findFirst({
          where: { paymentRef: appTransId }
        });

        if (booking && booking.status === BookingStatus.PENDING) {
          // Dùng update để xác nhận đơn hàng
          await prisma.booking.update({
            where: { id: booking.id },
            data: { 
              status: BookingStatus.CONFIRMED, 
              paymentTime: new Date() 
            }
          });
          
          result.return_code = 1;
          result.return_message = "success";
        } else {
          // Đã CONFIRMED rồi thì không cần update nữa nhưng vẫn báo thành công cho ZaloPay khỏi gọi lại
          result.return_code = 1;
          result.return_message = "already processed";
        }
      }
    } catch (error) {
      console.error("Callback Error:", error.message);
      result.return_code = 0; // ZaloPay sẽ thử lại sau
      result.return_message = error.message;
    }

    return result; // Trả object này về cho Controller để res.json(result)
  }
}
module.exports = paymentService