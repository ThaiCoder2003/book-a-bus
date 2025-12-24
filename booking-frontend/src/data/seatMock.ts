import type { Seat } from "@/types/seat.type";

export const MOCK_SEATS: Seat[] = [
  {
    id: "s1",
    busId: "bus1",
    label: "A1",
    floor: 1,
    row: 1,
    col: 1,
    type: "VIP",
    isAvailable: true,
  },
  {
    id: "s2",
    busId: "bus1",
    label: "A2",
    floor: 1,
    row: 1,
    col: 2,
    type: "VIP",
    isAvailable: false,
  },
  {
    id: "s3",
    busId: "bus1",
    label: "B1",
    floor: 2,
    row: 1,
    col: 1,
    type: "DOUBLE_BED",
    isAvailable: true,
  },
];
