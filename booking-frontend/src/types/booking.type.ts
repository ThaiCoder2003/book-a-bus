import type { BookingStatus } from "./enum";
import type { Ticket } from "./ticket.type";
import type { Trip } from "./trip.type";
import type { User } from "./user.type";
import type { Station } from "./station.type";

export interface Booking {
  id: string;
  userId: string;
  tripId: string;
  status: BookingStatus;
  totalAmount: number; // Decimal mapped to number

  departureStationId: string;
  arrivalStationId: string;

  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
  expiredAt: string; // ISO Date String

  // --- Payment info ---
  paymentTime?: string | null; // ISO Date String, thời điểm thanh toán ZaloPay
  paymentRef?: string | null; // reference transaction từ ZaloPay Sandbox

  // Relations
  user?: User; // Muốn lấy tên/sđt người đặt thì lấy từ đây: booking.user.name
  trip?: Trip;
  departureStation?: Station;
  arrivalStation?: Station;
  tickets?: Ticket[];
}
