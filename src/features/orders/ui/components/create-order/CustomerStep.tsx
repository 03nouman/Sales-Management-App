import { useState } from "react";
import { UserPlus, UserRound } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import type { CreateOrderFormValues } from "../../../hooks/useCreateOrder";

import type {
  Customer,
  CreateCustomerPayload,
} from "../../../../customers/types/customer.types";

type Props = {
  form: UseFormReturn<CreateOrderFormValues>;

  customers: Customer[];

  selectedCustomer: Customer | null;

  customerMode: "existing" | "new";

  isCreatingCustomer: boolean;

  onCustomerModeChange: (mode: "existing" | "new") => void;

  onCreateCustomer: (data: CreateCustomerPayload) => Customer | null;

  onNext: () => void;
};

export function CustomerStep({
  form,

  customers,

  selectedCustomer,

  customerMode,

  isCreatingCustomer,

  onCustomerModeChange,

  onCreateCustomer,

  onNext,
}: Props) {
  const [newCustomer, setNewCustomer] = useState<CreateCustomerPayload>({
    name: "",

    phone: "",

    email: "",

    address: "",

    tier: "Regular",
  });

  const [newCustomerError, setNewCustomerError] = useState<string | null>(null);

  /* =======================================================
     CREATE CUSTOMER
  ======================================================= */

  const handleCreateCustomer = () => {
    setNewCustomerError(null);

    const name = newCustomer.name.trim();

    const phone = newCustomer.phone.trim();

    if (!name) {
      setNewCustomerError("Customer name is required.");

      return;
    }

    if (!phone) {
      setNewCustomerError("Phone number is required.");

      return;
    }

    const existingPhone = customers.some(
      (customer) => customer.phone.trim() === phone,
    );

    if (existingPhone) {
      setNewCustomerError("A customer with this phone number already exists.");

      return;
    }

    const created = onCreateCustomer({
      ...newCustomer,

      name,

      phone,
    });

    if (created) {
      setNewCustomer({
        name: "",

        phone: "",

        email: "",

        address: "",

        tier: "Regular",
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* ===================================================
          HEADER
      =================================================== */}

      <section>
        <h3 className="text-base font-bold text-slate-900">Select Customer</h3>

        <p className="mt-1 text-xs text-slate-500">
          Select an existing customer or create a new customer for this order.
        </p>
      </section>

      {/* ===================================================
          CUSTOMER MODE
      =================================================== */}

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onCustomerModeChange("existing")}
          className={`
            flex
            items-center
            gap-3
            rounded-xl
            border
            p-4
            text-left
            transition
            ${
              customerMode === "existing"
                ? "border-[#263c93] bg-[#f6f7ff]"
                : "border-slate-200 bg-white hover:border-slate-300"
            }
          `}
        >
          <span
            className={`
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-lg
              ${
                customerMode === "existing"
                  ? "bg-[#263c93] text-white"
                  : "bg-slate-100 text-slate-500"
              }
            `}
          >
            <UserRound size={17} />
          </span>

          <span>
            <span className="block text-sm font-semibold text-slate-900">
              Existing Customer
            </span>

            <span className="mt-0.5 block text-[11px] text-slate-500">
              Select from customer list
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onCustomerModeChange("new")}
          className={`
            flex
            items-center
            gap-3
            rounded-xl
            border
            p-4
            text-left
            transition
            ${
              customerMode === "new"
                ? "border-[#263c93] bg-[#f6f7ff]"
                : "border-slate-200 bg-white hover:border-slate-300"
            }
          `}
        >
          <span
            className={`
              grid
              h-9
              w-9
              shrink-0
              place-items-center
              rounded-lg
              ${
                customerMode === "new"
                  ? "bg-[#263c93] text-white"
                  : "bg-slate-100 text-slate-500"
              }
            `}
          >
            <UserPlus size={17} />
          </span>

          <span>
            <span className="block text-sm font-semibold text-slate-900">
              New Customer
            </span>

            <span className="mt-0.5 block text-[11px] text-slate-500">
              Create a new customer
            </span>
          </span>
        </button>
      </div>

      {/* ===================================================
          EXISTING CUSTOMER
      =================================================== */}

      {customerMode === "existing" && (
        <form onSubmit={form.handleSubmit(onNext)} className="space-y-5">
          <div>
            <label
              htmlFor="customerId"
              className="mb-1.5 block text-xs font-semibold text-slate-700"
            >
              Customer
            </label>

            <select
              id="customerId"
              {...form.register("customerId", {
                required: "Please select a customer",

                setValueAs: (value) => {
                  if (value === "") {
                    return null;
                  }

                  const parsedValue = Number(value);

                  return Number.isNaN(parsedValue) ? null : parsedValue;
                },
              })}
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
              <option value="">Select customer</option>

              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}

                  {customer.phone ? ` — ${customer.phone}` : ""}
                </option>
              ))}
            </select>

            {form.formState.errors.customerId && (
              <p className="mt-1.5 text-xs text-red-500">
                {form.formState.errors.customerId.message}
              </p>
            )}
          </div>

          {/* =============================================
              SELECTED CUSTOMER
          ============================================== */}

          {selectedCustomer && <CustomerPreview customer={selectedCustomer} />}

          {/* =============================================
              ACTION
          ============================================== */}

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="submit"
              disabled={!selectedCustomer}
              className="
                rounded-xl
                bg-[#263c93]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#1f317d]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Continue
            </button>
          </div>
        </form>
      )}

      {/* ===================================================
          NEW CUSTOMER
      =================================================== */}

      {customerMode === "new" && (
        <section className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* NAME */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Customer Name
              </label>

              <input
                type="text"
                value={newCustomer.name}
                onChange={(event) =>
                  setNewCustomer((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Enter customer name"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                  focus:ring-2
                  focus:ring-[#263c93]/10
                "
              />
            </div>

            {/* PHONE */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(event) =>
                  setNewCustomer((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="Enter phone number"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                  focus:ring-2
                  focus:ring-[#263c93]/10
                "
              />
            </div>

            {/* EMAIL */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Email
                <span className="ml-1 font-normal text-slate-400">
                  (Optional)
                </span>
              </label>

              <input
                type="email"
                value={newCustomer.email ?? ""}
                onChange={(event) =>
                  setNewCustomer((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                placeholder="customer@example.com"
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  px-3
                  text-sm
                  outline-none
                  focus:border-[#263c93]
                  focus:ring-2
                  focus:ring-[#263c93]/10
                "
              />
            </div>

            {/* TIER */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                Customer Tier
              </label>

              <select
                value={newCustomer.tier ?? "Regular"}
                onChange={(event) =>
                  setNewCustomer((current) => ({
                    ...current,

                    tier: event.target.value as "Regular" | "Silver" | "Gold",
                  }))
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
          </div>

          {/* ADDRESS */}

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Address
              <span className="ml-1 font-normal text-slate-400">
                (Optional)
              </span>
            </label>

            <textarea
              value={newCustomer.address ?? ""}
              onChange={(event) =>
                setNewCustomer((current) => ({
                  ...current,

                  address: event.target.value,
                }))
              }
              placeholder="Enter customer address"
              rows={3}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                px-3
                py-2.5
                text-sm
                outline-none
                focus:border-[#263c93]
                focus:ring-2
                focus:ring-[#263c93]/10
              "
            />
          </div>

          {/* ERROR */}

          {newCustomerError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
              {newCustomerError}
            </div>
          )}

          {/* ACTIONS */}

          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={handleCreateCustomer}
              disabled={isCreatingCustomer}
              className="
                rounded-xl
                bg-[#263c93]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#1f317d]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isCreatingCustomer ? "Creating..." : "Create & Continue"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* =========================================================
   CUSTOMER PREVIEW
========================================================= */

function CustomerPreview({ customer }: { customer: Customer }) {
  return (
    <section
      className="
        rounded-xl
        border
        border-[#d9ddf5]
        bg-[#f6f7ff]
        p-4
      "
    >
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

      <div className="mt-3">
        <p className="text-sm font-bold text-slate-900">{customer.name}</p>

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
    </section>
  );
}
