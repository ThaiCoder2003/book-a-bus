// src/constants/seatTypeMeta.ts
import type { SeatType } from "@/types/enum";

export const SEAT_TYPE_META: Record<
  SeatType,
  { label: string; color: string }
> = {
  SEAT: {
    label: "Ghế thường",
    color: "bg-blue-500",
  },
  VIP: {
    label: "Ghế VIP",
    color: "bg-purple-500",
  },
  SINGLE_BED: {
    label: "Giường đơn",
    color: "bg-yellow-500",
  },
  DOUBLE_BED: {
    label: "Giường đôi",
    color: "bg-red-500",
  },
};
