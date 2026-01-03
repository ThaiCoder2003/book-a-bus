import type { Booking } from "../booking.type";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders?: number;
  totalSpent?: number;
  createdAt: string;
  bookings?: Booking[];
}
