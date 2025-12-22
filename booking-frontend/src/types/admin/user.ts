export interface Booking {
  id: string;
  date: string;
  service: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
  bookingHistory?: Booking[];
}
