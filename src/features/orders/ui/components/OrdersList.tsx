import type { Order } from "../../types/order.types";
import { OrderCard } from "./OrderCard";

type Props = {
  orders: Order[];
  onViewOrder: (order: Order) => void;
};

export function OrdersList({ orders, onViewOrder }: Props) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-semibold text-slate-700">No orders found</p>

        <p className="mt-1 text-xs text-slate-500">
          Try changing your filters or create a new order.
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onView={onViewOrder} />
      ))}
    </section>
  );
}
