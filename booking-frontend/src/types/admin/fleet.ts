// src/types/fleet.ts

export type SeatType = "Standard" | "VIP" | "Luxury" | "Empty";

export interface Seat {
  id: string;
  type: SeatType;
  price?: number; // Giá vé (ví dụ: 200000 VND)
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string; // Biển số xe
  type: string; // Loại xe (vd: Limousine, Giường nằm, Ghế ngồi)
  status: "Active" | "Maintenance"; // Trạng thái: Đang hoạt động / Đang bảo trì
  capacity: number; // Tổng số ghế
  amenities: string[]; // Tiện nghi (vd: 'WiFi', 'USB Port', 'AC', 'Restroom')
  seatLayout: Seat[];
}
