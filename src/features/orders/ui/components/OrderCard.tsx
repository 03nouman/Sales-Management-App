import { ChevronRight } from "lucide-react";
import { formatPrice } from "../../../../lib/currency";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "../../types/order.types";
import { getOrderProgress } from "../../utils/orderHelpers";

type Props = {
  order: Order;
  onView: (order: Order) => void;
};

export function OrderCard({ order, onView }: Props) {
  const progress = getOrderProgress(order.orderStatus);

  return (
    <article className="rounded-xl border border-[#ddd9e8] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-[#eef0ff] px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#263c93]">
              Customer Order
            </span>

            <span className="font-mono text-[10px] text-slate-500">
              #{order.orderNumber}
            </span>
          </div>

          <h3 className="mt-2 text-[15px] font-bold text-slate-900">
            {order.customerName}
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {order.items.length} product
            {order.items.length !== 1 ? "s" : ""} ·{" "}
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
          </p>
        </div>

        <OrderStatusBadge status={order.orderStatus} />
      </div>

      <div className="my-4 h-px bg-slate-100" />

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Delivery
          </p>

          <p className="mt-1 text-[11px] font-semibold text-slate-800">
            {order.deliveryDate || "Not scheduled"}
          </p>
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Payment
          </p>

          <p className="mt-1 text-[11px] font-semibold text-slate-800">
            {order.paymentStatus}
          </p>
        </div>

        <div>
          <p className="text-[9px] uppercase tracking-wide text-slate-400">
            Value
          </p>

          <p className="mt-1 text-[11px] font-bold text-slate-900">
            {formatPrice(order.total)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-[9px] text-slate-500">
          <span>Ordered</span>
          <span>Processing</span>
          <span>Delivered</span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-[#e9eafa]">
          <div
            className="h-full rounded-full bg-[#263c93] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onView(order)}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#263c93]"
        >
          View Details
          <ChevronRight size={13} />
        </button>
      </div>
    </article>
  );
}
