import type { Order, OrderItem, PaymentStatus } from "../types/order.types";

/* =========================================================
   CALCULATE SUBTOTAL
========================================================= */

export function calculateSubtotal(items: OrderItem[]): number {
  return items.reduce((total, item) => total + item.total, 0);
}

/* =========================================================
   CALCULATE ITEM TOTAL
========================================================= */

export function calculateItemTotal(price: number, quantity: number): number {
  return Number((price * quantity).toFixed(2));
}

/* =========================================================
   CALCULATE REMAINING PAYMENT
========================================================= */

export function calculateRemainingAmount(
  total: number,
  paidAmount: number,
): number {
  return Math.max(total - paidAmount, 0);
}

/* =========================================================
   CALCULATE PAYMENT STATUS
========================================================= */

export function calculatePaymentStatus(
  total: number,
  paidAmount: number,
): PaymentStatus {
  if (paidAmount <= 0) {
    return "Pending";
  }

  if (paidAmount >= total) {
    return "Paid";
  }

  return "Partially Paid";
}

/* =========================================================
   GENERATE ORDER NUMBER
========================================================= */

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);

  const random = Math.floor(100 + Math.random() * 900);

  return `ORD-${timestamp}-${random}`;
}

/* =========================================================
   GET ORDER PROGRESS
========================================================= */

export function getOrderProgress(status: Order["orderStatus"]): number {
  const progressMap: Record<Order["orderStatus"], number> = {
    Pending: 15,

    Confirmed: 30,

    Processing: 55,

    Dispatched: 80,

    Completed: 100,

    Cancelled: 0,
  };

  return progressMap[status];
}
