import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../../../../../lib/currency";
import type { OrderItem } from "../../../types/order.types";

type Props = {
  items: OrderItem[];
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
};

export function SelectedProducts({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">
          No products selected
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Select a product above to add it to this order.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.productId}
          className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {item.productName}
            </p>

            <p className="text-[10px] text-slate-500">
              {item.sku} · {formatPrice(item.price)} each
            </p>
          </div>

          <div className="flex items-center rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => onDecrease(item.productId)}
              className="grid h-8 w-8 place-items-center"
            >
              <Minus size={13} />
            </button>

            <span className="w-7 text-center text-xs font-semibold">
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() => onIncrease(item.productId)}
              className="grid h-8 w-8 place-items-center"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="w-20 text-right">
            <p className="text-xs font-bold text-slate-900">
              {formatPrice(item.total)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.productId)}
            className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
