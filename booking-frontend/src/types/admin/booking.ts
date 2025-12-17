// src/types/booking.ts
export interface Booking {
  id: string;
  customer: string;
  route: string;
  departureDate: string;
  totalPrice: string;
  status: "Đã xác nhận" | "Đang chờ" | "Đã hủy";
  paymentStatus: "Đã thanh toán" | "Chưa thanh toán" | "Đã hoàn tiền";
}
