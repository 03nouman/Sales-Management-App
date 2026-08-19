import { X } from "lucide-react";
import { formatPrice } from "../../../../lib/currency";
import { OrderStatusBadge } from "./OrderStatusBadge";
import type { Order } from "../../types/order.types";

type Props = {
  order: Order | null;
  onClose: () => void;
};

export function OrderDetailsModal({ order, onClose }: Props) {
  if (!order) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl">
        <header className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <p className="font-mono text-[10px] text-slate-500">
              #{order.orderNumber}
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Order Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 p-5">
          <section className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-slate-400">
                Customer
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {order.customerName}
              </p>
            </div>

            <OrderStatusBadge status={order.orderStatus} />
          </section>

          <section>
            <h3 className="mb-3 text-sm font-bold text-slate-900">Products</h3>

            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.productName}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>

                  <p className="text-sm font-bold">{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2 rounded-xl bg-slate-50 p-4">
            <SummaryRow label="Subtotal" value={formatPrice(order.subtotal)} />

            <SummaryRow
              label="Discount"
              value={`-${formatPrice(order.discount)}`}
            />

            <SummaryRow label="Tax" value={formatPrice(order.tax)} />

            <div className="my-2 border-t border-slate-200" />

            <SummaryRow label="Total" value={formatPrice(order.total)} strong />

            <SummaryRow label="Paid" value={formatPrice(order.paidAmount)} />

            <SummaryRow
              label="Remaining"
              value={formatPrice(order.remainingAmount)}
            />
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <Info label="Payment Type" value={order.paymentType} />
            <Info label="Payment Status" value={order.paymentStatus} />
            <Info label="Delivery Date" value={order.deliveryDate || "—"} />
            <Info label="Delivery Time" value={order.deliveryTime || "—"} />
          </section>

          <section>
            <p className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">
              Billing Address
            </p>

            <p className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
              {order.billingAddress}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">{label}</span>

      <span
        className={
          strong
            ? "text-base font-bold text-slate-950"
            : "text-xs font-semibold text-slate-700"
        }
      >
        {value}
      </span>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
