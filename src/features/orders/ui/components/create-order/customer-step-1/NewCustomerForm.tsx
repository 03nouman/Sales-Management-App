import type { Customer } from "../../../../../customers/types/customer.types";
import type { CustomerTier } from "../../../../../customers/types/customer.types";

import type { NewCustomerFormValues } from "../../../../../customers/hooks/useCustomer";

type Props = {
  values: NewCustomerFormValues;

  error: string | null;

  onUpdate: <K extends keyof NewCustomerFormValues>(
    field: K,
    value: NewCustomerFormValues[K],
  ) => void;

  onSubmit: () => Customer | null;
};

export function NewCustomerForm({ values, error, onUpdate, onSubmit }: Props) {
  return (
    <section
      className="
        rounded-2xl
        border
        border-slate-200
        bg-slate-50/60
        p-5
      "
    >
      <div>
        <h4 className="text-sm font-bold text-slate-900">
          Create New Customer
        </h4>

        <p className="mt-1 text-xs text-slate-500">
          Customer details will be saved locally and available for future
          orders.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="new-customer-name"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Name
          </label>

          <input
            id="new-customer-name"
            type="text"
            value={values.name}
            onChange={(event) => onUpdate("name", event.target.value)}
            placeholder="Customer name"
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              outline-none
              transition
              focus:border-[#263c93]
              focus:ring-2
              focus:ring-[#263c93]/10
            "
          />
        </div>

        <div>
          <label
            htmlFor="new-customer-phone"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Phone
          </label>

          <input
            id="new-customer-phone"
            type="tel"
            value={values.phone}
            onChange={(event) => onUpdate("phone", event.target.value)}
            placeholder="Phone number"
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              outline-none
              transition
              focus:border-[#263c93]
              focus:ring-2
              focus:ring-[#263c93]/10
            "
          />
        </div>

        <div>
          <label
            htmlFor="new-customer-email"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Email
          </label>

          <input
            id="new-customer-email"
            type="email"
            value={values.email}
            onChange={(event) => onUpdate("email", event.target.value)}
            placeholder="Email address"
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              outline-none
              transition
              focus:border-[#263c93]
              focus:ring-2
              focus:ring-[#263c93]/10
            "
          />
        </div>

        <div>
          <label
            htmlFor="new-customer-tier"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Customer Tier
          </label>

          <select
            id="new-customer-tier"
            value={values.tier}
            onChange={(event) =>
              onUpdate("tier", event.target.value as CustomerTier)
            }
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              text-sm
              outline-none
              transition
              focus:border-[#263c93]
              focus:ring-2
              focus:ring-[#263c93]/10
            "
          >
            <option value="Regular">Regular</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="new-customer-address"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Address
          </label>

          <textarea
            id="new-customer-address"
            value={values.address}
            onChange={(event) => onUpdate("address", event.target.value)}
            placeholder="Customer address"
            rows={3}
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-slate-200
              bg-white
              px-3
              py-2.5
              text-sm
              outline-none
              transition
              focus:border-[#263c93]
              focus:ring-2
              focus:ring-[#263c93]/10
            "
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="
            mt-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-3
            py-2.5
            text-xs
            text-red-700
          "
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={onSubmit}
        className="
          mt-5
          rounded-xl
          bg-[#263c93]
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-[#1f317d]
          focus:outline-none
          focus:ring-2
          focus:ring-[#263c93]/20
        "
      >
        Create Customer
      </button>
    </section>
  );
}
