// TransactionFeed.status.ts
import type { BookingStatus } from "@/types/enum";

export const BOOKING_STATUS_UI: Record<
  BookingStatus,
  {
    label: string;
    className: string;
  }
> = {
  CONFIRMED: {
    label: "Paid",
    className: "bg-green-100 text-green-600",
  },
  PENDING: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-600",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-600",
  },
};
