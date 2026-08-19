import type {
  OrderStatus,
  PaymentStatus,
  PaymentType,
} from "../types/order.types";

export const orderStatuses: OrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Dispatched",
  "Completed",
  "Cancelled",
];

export const paymentStatuses: PaymentStatus[] = [
  "Pending",
  "Partially Paid",
  "Paid",
  "Refunded",
];

export const paymentTypes: PaymentType[] = [
  "Cash",
  "UPI",
  "Debit/Credit Card",
  "Bank Transfer",
];

export const orderStatusColors: Record<OrderStatus, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  Processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Dispatched: "bg-violet-50 text-violet-700 border-violet-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};
