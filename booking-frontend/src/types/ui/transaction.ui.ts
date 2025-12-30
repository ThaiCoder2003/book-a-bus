// types/ui/transaction.ui.ts
import type { BookingStatus } from "../enum";

export interface TransactionUI {
  id: string;
  totalAmount: number;
  status: BookingStatus;
  user: {
    name: string;
    email: string;
  };
}