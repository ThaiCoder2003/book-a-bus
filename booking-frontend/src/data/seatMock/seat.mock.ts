import type { Seat } from "@/types/seat.type";
import type { Bus } from "@/types/bus.type";
export const mockBuses: Bus[] = [
  {
    id: "bus-001",
    name: "Xe giường nằm VIP",
    plateNumber: "51A-12345",
    totalSeats: 24,
  },
];
export const mockSeats: Seat[] = [
  {
    id: "seat-01",
    busId: "bus-001",
    label: "A01",
    floor: 1,
    row: 1,
    col: 1,
    type: "SINGLE_BED",
    isAvailable: false,
  },
  {
    id: "seat-02",
    busId: "bus-001",
    label: "A02",
    floor: 1,
    row: 1,
    col: 2,
    type: "SINGLE_BED",
    isAvailable: true,
  },
  {
    id: "seat-03",
    busId: "bus-001",
    label: "B01",
    floor: 1,
    row: 2,
    col: 1,
    type: "SEAT",
    isAvailable: true,
  },
  {
    id: "seat-04",
    busId: "bus-001",
    label: "B02",
    floor: 1,
    row: 2,
    col: 2,
    type: "SEAT",
    isAvailable: false,
  },
];
