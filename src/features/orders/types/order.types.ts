export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Dispatched"
  | "Completed"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Partially Paid" | "Paid" | "Refunded";

export type PaymentType =
  | "Cash"
  | "UPI"
  | "Debit/Credit Card"
  | "Bank Transfer";

export type OrderType = "Delivery" | "Pickup";

export type OrderItem = {
  productId: number;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  paymentType: PaymentType;
  orderStatus: OrderStatus;
  orderType: OrderType;
  billingAddress: string;
  createdAt: string;
  deliveryDate: string;
  deliveryTime: string;
};

export type CreateOrderPayload = {
  customerId: number;
  customerName: string;
  customerPhone: string;

  items: OrderItem[];

  subtotal: number;
  discount: number;
  tax: number;
  total: number;

  paidAmount: number;
  remainingAmount: number;

  paymentStatus: PaymentStatus;
  paymentType: PaymentType;

  orderStatus: OrderStatus;
  orderType: OrderType;

  billingAddress: string;

  deliveryDate: string;
  deliveryTime: string;
};

export type UpdateOrderStatusPayload = {
  orderId: number;
  status: OrderStatus;
};

export type UpdateOrderPaymentPayload = {
  orderId: number;
  paidAmount: number;
  paymentType: PaymentType;
};