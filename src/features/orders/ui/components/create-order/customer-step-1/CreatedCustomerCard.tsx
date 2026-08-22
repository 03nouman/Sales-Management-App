import { Check } from "lucide-react";

import type { Customer } from "../../../../../customers/types/customer.types";

type Props = {
  customer: Customer;

  onCreateAnotherCustomer: () => void;
};

export function CreatedCustomerCard({
  customer,
  onCreateAnotherCustomer,
}: Props) {
  return (
    <section
      className="
        rounded-xl
        border
        border-emerald-200
        bg-emerald-50
        p-4
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-emerald-700
            "
          >
            Customer Created
          </p>

          <p className="mt-2 text-sm font-bold text-slate-900">
            {customer.name}
          </p>

          <div className="mt-2 space-y-1">
            {customer.phone && (
              <p className="text-xs text-slate-600">Phone: {customer.phone}</p>
            )}

            {customer.email && (
              <p className="text-xs text-slate-600">Email: {customer.email}</p>
            )}

            {customer.address && (
              <p className="text-xs text-slate-600">
                Address: {customer.address}
              </p>
            )}

            {customer.tier && (
              <p className="text-xs text-slate-600">
                Tier: <span className="font-semibold">{customer.tier}</span>
              </p>
            )}
          </div>
        </div>

        <Check size={20} className="shrink-0 text-emerald-600" />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onCreateAnotherCustomer}
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            px-4
            py-2.5
            text-xs
            font-semibold
            text-slate-700
            transition
            hover:bg-slate-50
          "
        >
          Create Another
        </button>
      </div>
    </section>
  );
}
