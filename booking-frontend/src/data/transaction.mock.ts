import type { TransactionUI } from "@/types/ui/transaction.ui";

export const TRANSACTION_MOCK: TransactionUI[] = [
  {
    id: "1",
    totalAmount: 200000,
    status: "CONFIRMED",
    user: {
      name: "User A",
      email: "user.a@example.com",
    },
  },
  {
    id: "2",
    totalAmount: 150000,
    status: "PENDING",
    user: {
      name: "User B",
      email: "user.b@example.com",
    },
  },
  {
    id: "3",
    totalAmount: 300000,
    status: "CANCELLED",
    user: {
      name: "User C",
      email: "user.c@example.com",
    },
  },
];
