import type { Customer } from "../../../../../customers/types/customer.types";

type Props = {
  customer: Customer;

  onChangeSelectedCustomer: () => void;
};

export function SelectedCustomerCard({
  customer,
  onChangeSelectedCustomer,
}: Props) {
  return (
    <section
      className="
        max-w-xl
        rounded-xl
        border
        border-[#d9ddf5]
        bg-[#f6f7ff]
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
              text-[#263c93]
            "
          >
            Selected Customer
          </p>

          <p className="mt-2 text-sm font-bold text-slate-900">
            {customer.name}
          </p>

          <div className="mt-2 space-y-1">
            {customer.phone && (
              <p className="text-xs text-slate-500">Phone: {customer.phone}</p>
            )}

            {customer.email && (
              <p className="text-xs text-slate-500">Email: {customer.email}</p>
            )}

            {customer.address && (
              <p className="text-xs text-slate-600">
                Address: {customer.address}
              </p>
            )}

            {customer.tier && (
              <p className="text-xs text-slate-500">
                Tier:{" "}
                <span className="font-semibold text-slate-700">
                  {customer.tier}
                </span>
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeSelectedCustomer}
          className="
            shrink-0
            text-xs
            font-semibold
            text-[#263c93]
            hover:underline
          "
        >
          Change
        </button>
      </div>
    </section>
  );
}
