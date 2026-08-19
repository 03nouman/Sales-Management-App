import type { Order } from "./order.types";

export type OrdersState = {
  orders: Order[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
  selectedOrderId: number | null;
};
