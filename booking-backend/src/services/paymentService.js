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
    const transId = `${dateStr}_${bookingId}_${Math.floor(Math.random() * 1000)}`;
    const order = {
      app_id: parseInt(ZALOPAY_APP_ID),
      app_trans_id: transId,
      app_user: 'demo_user',
      app_time: Date.now(),
      item: JSON.stringify([{ bookingId }]),
      embed_data: JSON.stringify({}),
      amount,
      description: `Payment for booking #${bookingId}`,
      bank_code: '',
      callback_url: ZALOPAY_CALLBACK_URL
    }

    const data =
      `${order.app_id}|${order.app_trans_id}|${order.app_user}|${order.amount}|${order.app_time}|${order.embed_data}|${order.item}`

    order.mac = crypto
      .createHmac('sha256', ZALOPAY_KEY1)
      .update(data)
      .digest('hex')

    try {
      const response = await axios.post(ZALOPAY_ENDPOINT, order)

      // Cap nhat trang thai booking
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.CONFIRMED }
      })
      return response.data
    } catch (error) {
      throw new Error(`ZaloPay payment creation failed: ${error.message}`)
    }
  }
}
module.exports = paymentService