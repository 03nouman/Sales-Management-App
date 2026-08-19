import type { UseFormReturn } from "react-hook-form";
import type { CreateOrderFormValues } from "../../../hooks/useCreateOrder";

type Customer = {
  id?: number;
  name?: string;
  phone?: string;
  address?: string;
};

type Props = {
  form: UseFormReturn<CreateOrderFormValues>;
  customers: Customer[];
  selectedCustomer?: Customer | null;
  onNext: () => void;
};

export function CustomerStep({
  form,
  customers,
  selectedCustomer,
  onNext,
}: Props) {
  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-5">
      <section>
        <h3 className="text-base font-bold text-slate-900">Select Customer</h3>

        <p className="mt-1 text-xs text-slate-500">
          Choose an existing customer before adding products.
        </p>
      </section>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
          Customer
        </label>

        <select
          {...form.register("customerId", {
            required: "Please select a customer",
            valueAsNumber: true,
          })}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#263c93]"
        >
          <option value="">Select customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
              {customer.phone ? ` — ${customer.phone}` : ""}
            </option>
          ))}
        </select>

        {form.formState.errors.customerId && (
          <p className="mt-1 text-xs text-red-500">
            {form.formState.errors.customerId.message}
          </p>
        )}
      </div>

      {selectedCustomer && (
        <div className="rounded-xl border border-[#d9ddf5] bg-[#f6f7ff] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#263c93]">
            Selected Customer
          </p>

          <p className="mt-1 text-sm font-bold text-slate-900">
            {selectedCustomer.name}
          </p>

          {selectedCustomer.phone && (
            <p className="mt-1 text-xs text-slate-500">
              {selectedCustomer.phone}
            </p>
          )}

          {selectedCustomer.address && (
            <p className="mt-2 text-xs text-slate-600">
              {selectedCustomer.address}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end border-t border-slate-100 pt-4">
        <button
          type="submit"
          className="rounded-xl bg-[#263c93] px-5 py-2.5 text-sm font-semibold text-white"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
