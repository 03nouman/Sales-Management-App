import type { UseFormReturn } from "react-hook-form";
import { formatPrice } from "../../../../../lib/currency";
import type { CreateOrderFormValues, OrderItem, PaymentStatus } from "../../../types/order.types";
import { SelectedProducts } from "./SelectedProducts";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
};

type Props = {
  form: UseFormReturn<CreateOrderFormValues>;
  products: Product[];
  selectedItems: OrderItem[];
  subtotal: number;
  total: number;
  remainingAmount: number;
  paymentStatus: PaymentStatus;
  onAddProduct: (id: number) => void;
  onIncrease: (id: number) => void;
  onDecrease: (id: number) => void;
  onRemove: (id: number) => void;
  onBack: () => void;
  onSubmit: SubmitHandler<CreateOrderFormValues>;
};

export function OrderItemsStep({
  form,
  products,
  selectedItems,
  subtotal,
  total,
  remainingAmount,
  paymentStatus,
  onAddProduct,
  onIncrease,
  onDecrease,
  onRemove,
  onBack,
  onSubmit,
}: Props) {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-base font-bold text-slate-900">Products</h3>

        <select
          defaultValue=""
          onChange={(event) => {
            const id = Number(event.target.value);

            if (id) {
              onAddProduct(id);
              event.target.value = "";
            }
          }}
          className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#263c93]"
        >
          <option value="">Add product...</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} — {formatPrice(product.price)}
            </option>
          ))}
        </select>
      </section>

      <SelectedProducts
        items={selectedItems}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
        onRemove={onRemove}
      />

      <section>
        <h3 className="mb-3 text-sm font-bold text-slate-900">Delivery</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            {...form.register("deliveryDate", {
              required: "Delivery date is required",
            })}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#263c93]"
          />

          <input
            type="time"
            {...form.register("deliveryTime", {
              required: "Delivery time is required",
            })}
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#263c93]"
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-bold text-slate-900">Payment</h3>

        <div className="grid gap-3 sm:grid-cols-2">
          <select
            {...form.register("paymentType")}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#263c93]"
          >
            <option value="Cash">Cash</option>
            <option value="UPI">Online UPI</option>
            <option value="Debit/Credit Card">Debit/Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          <input
            type="number"
            min={0}
            max={total}
            step="0.01"
            {...form.register("paidAmount", {
              valueAsNumber: true,
              min: 0,
            })}
            placeholder="Advance / paid amount"
            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#263c93]"
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Payment status:{" "}
          <span className="font-semibold text-slate-800">{paymentStatus}</span>
        </p>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-bold text-slate-900">
          Billing Address
        </h3>

        <textarea
          {...form.register("billingAddress", {
            required: "Billing address is required",
          })}
          rows={3}
          placeholder="Enter billing address..."
          className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#263c93]"
        />
      </section>

      <section className="rounded-xl bg-slate-50 p-4">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="mt-2 flex justify-between text-base font-bold text-slate-950">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>Remaining</span>
          <span>{formatPrice(remainingAmount)}</span>
        </div>
      </section>

      <div className="flex justify-between border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
        >
          Back
        </button>

        <button
          type="button"
          disabled={selectedItems.length === 0}
          onClick={onSubmit}
          className="rounded-xl bg-[#263c93] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Create Order
        </button>
      </div>
    </div>
  );
}
