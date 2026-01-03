import axiosClient from "./axiosConfig"

const paymentService = {
    // Gọi API backend để lấy link thanh toán ZaloPay
    createZaloPayUrl: (bookingId: string) => {
        return axiosClient.post(`/payment/zalopay/${bookingId}`)
    },
}

export default paymentService
