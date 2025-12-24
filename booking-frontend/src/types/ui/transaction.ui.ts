// types/ui/transaction.ui.ts
import type { BookingStatus } from "../enum";

export interface TransactionUI {
  id: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: BookingStatus;
}
