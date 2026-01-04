export interface ZaloPayOrderResponse {
    return_code: number
    return_message: string
    sub_return_code: number
    sub_return_message: string
    zp_trans_token: string
    order_url: string // Link để redirect hoặc tạo QR
    cashier_order_url: string
    order_token: string
    qr_code: string // Chuỗi raw QR (VietQR)
}
