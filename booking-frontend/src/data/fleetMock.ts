import type { Vehicle } from "../types/fleet";

export const mockFleet: Vehicle[] = [
  {
    id: "v001",
    name: "Xe Limousine 01",
    licensePlate: "51A-12345",
    type: "Limousine",
    status: "Active",
    capacity: 24,
    amenities: ["WiFi", "Cổng USB"],
    seatLayout: [],
  },
  {
    id: "v002",
    name: "Xe Giường Nằm 02",
    licensePlate: "51B-67890",
    type: "Giường nằm",
    status: "Active",
    capacity: 40,
    amenities: ["WiFi", "Cổng USB", "Giường nằm"],
    seatLayout: [],
  },
  {
    id: "v003",
    name: "Xe Ghế Ngồi 03",
    licensePlate: "51C-11223",
    type: "Ghế ngồi",
    status: "Maintenance",
    capacity: 45,
    amenities: ["Cổng USB"],
    seatLayout: [],
  },
  // Bạn có thể duplicate thêm để đạt 24 xe tổng cộng
];
