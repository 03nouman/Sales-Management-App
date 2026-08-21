import type { UseFormReturn } from "react-hook-form";

import type { CreateOrderFormValues } from "../../../hooks/useCreateOrder";

import type { Customer } from "../../../../customers/types/customer.types";

import type { CustomerMode } from "../../../hooks/useCreateOrder";
import { useEffect } from "react";
import { useAppDispatch } from "../../../../../app/hooks";
import { loadLocalCustomers } from "../../../../customers/state/customerSlice";

type Props = {
  form: UseFormReturn<CreateOrderFormValues>;

  customers: Customer[];

  selectedCustomer: Customer | null;

  customerMode: CustomerMode;

  onModeChange: (mode: CustomerMode) => void;

  onSelectCustomer: (customerId: number | null) => void;

  onCreateCustomer: () => Customer | null;

  onNext: () => void;
};

export function CustomerStep({
  form,
  customers,
  selectedCustomer,
  customerMode,
  onModeChange,
  onSelectCustomer,
  onCreateCustomer,
  onNext,
}: Props) {
  let dispatch = useAppDispatch();
  const newCustomerName = form.watch("newCustomerName");
  const newCustomerPhone = form.watch("newCustomerPhone");

  /* =======================================================
     CREATE CUSTOMER
  ======================================================= */

  const handleCreateCustomer = () => {
    const customer = onCreateCustomer();

    if (!customer) {
      /*
       * Validation is handled below through
       * the form fields.
       */
      form.setError("newCustomerName", {
        type: "manual",
        message: "Customer name and phone are required.",
      });

      return;
    }

    form.clearErrors(["newCustomerName", "newCustomerPhone"]);
  };

  /* =======================================================
     CONTINUE
  ======================================================= */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onNext();
  };
  useEffect(() => {
    dispatch(loadLocalCustomers());
  }, []);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* =================================================
          HEADER
      ================================================== */}

      <section>
        <h3
          className="
            text-base
            font-bold
            text-slate-900
          "
        >
          Customer
        </h3>

        <p
          className="
            mt-1
            text-xs
            text-slate-500
          "
        >
          Select an existing customer or create a new customer for this order.
        </p>
      </section>

      {/* =================================================
          CUSTOMER MODE SWITCH
      ================================================== */}

      <div
        className="
          inline-flex
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-1
        "
      >
        <button
          type="button"
          onClick={() => onModeChange("existing")}
          className={`
            rounded-lg
            px-4
            py-2
            text-xs
            font-semibold
            transition
            ${
              customerMode === "existing"
                ? "bg-white text-[#263c93] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }
          `}
        >
          Existing Customer
        </button>

        <button
          type="button"
          onClick={() => onModeChange("new")}
          className={`
            rounded-lg
            px-4
            py-2
            text-xs
            font-semibold
            transition
            ${
              customerMode === "new"
                ? "bg-white text-[#263c93] shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }
          `}
        >
          New Customer
        </button>
      </div>

      {/* =================================================
          EXISTING CUSTOMER
      ================================================== */}

      {customerMode === "existing" && (
        <section
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
          "
        >
          <div className="max-w-xl">
            <label
              htmlFor="customerId"
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-slate-700
              "
            >
              Customer
            </label>

            <select
              id="customerId"
              value={selectedCustomer?.id ?? ""}
              onChange={(event) => {
                const value = event.target.value;

                onSelectCustomer(value ? Number(value) : null);
              }}
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

            {!selectedCustomer && (
              <p
                className="
                  mt-1.5
                  text-xs
                  text-slate-400
                "
              >
                Select a customer to continue.
              </p>
            )}
          </div>

          {/* =================================================
              SELECTED CUSTOMER
          ================================================== */}

          {selectedCustomer && <CustomerPreview customer={selectedCustomer} />}
        </section>
      )}

      {/* =================================================
          NEW CUSTOMER
      ================================================== */}

      {customerMode === "new" && (
        <section
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            p-4
          "
        >
          {/* -----------------------------------------------
              If customer has already been created
          ------------------------------------------------ */}

          {selectedCustomer ? (
            <div className="max-w-xl">
              <div
                className="
                  mb-4
                  flex
                  items-center
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-emerald-600
                    "
                  >
                    Customer Created
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    New customer has been added
                  </p>
                </div>
              </div>

              <CustomerPreview customer={selectedCustomer} />
            </div>
          ) : (
            /* ---------------------------------------------
               CREATE CUSTOMER FORM
            ---------------------------------------------- */

            <div className="max-w-xl">
              <div className="mb-5">
                <h4
                  className="
                    text-sm
                    font-bold
                    text-slate-900
                  "
                >
                  Create New Customer
                </h4>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Customer information will be saved locally for future orders.
                </p>
              </div>

              <div className="space-y-4">
                {/* -----------------------------------------
                    NAME
                ------------------------------------------ */}

                <div>
                  <label
                    htmlFor="newCustomerName"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >
                    Customer Name
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    id="newCustomerName"
                    type="text"
                    placeholder="Enter customer name"
                    {...form.register("newCustomerName", {
                      required: "Customer name is required",
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
                  />

                  {form.formState.errors.newCustomerName && (
                    <p
                      className="
                        mt-1.5
                        text-xs
                        text-red-500
                      "
                    >
                      {form.formState.errors.newCustomerName.message}
                    </p>
                  )}
                </div>

                {/* -----------------------------------------
                    PHONE
                ------------------------------------------ */}

                <div>
                  <label
                    htmlFor="newCustomerPhone"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >
                    Phone
                    <span className="text-red-500"> *</span>
                  </label>

                  <input
                    id="newCustomerPhone"
                    type="tel"
                    placeholder="Enter phone number"
                    {...form.register("newCustomerPhone", {
                      required: "Phone number is required",
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
                  />

                  {form.formState.errors.newCustomerPhone && (
                    <p
                      className="
                        mt-1.5
                        text-xs
                        text-red-500
                      "
                    >
                      {form.formState.errors.newCustomerPhone.message}
                    </p>
                  )}
                </div>

                {/* -----------------------------------------
                    EMAIL + TIER
                ------------------------------------------ */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="newCustomerEmail"
                      className="
                        mb-1.5
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                      "
                    >
                      Email
                    </label>

                    <input
                      id="newCustomerEmail"
                      type="email"
                      placeholder="customer@email.com"
                      {...form.register("newCustomerEmail")}
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
                      htmlFor="newCustomerTier"
                      className="
                        mb-1.5
                        block
                        text-xs
                        font-semibold
                        text-slate-700
                      "
                    >
                      Customer Tier
                    </label>

                    <select
                      id="newCustomerTier"
                      {...form.register("newCustomerTier")}
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
                </div>

                {/* -----------------------------------------
                    ADDRESS
                ------------------------------------------ */}

                <div>
                  <label
                    htmlFor="newCustomerAddress"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-semibold
                      text-slate-700
                    "
                  >
                    Address
                  </label>

                  <textarea
                    id="newCustomerAddress"
                    rows={3}
                    placeholder="Enter customer address"
                    {...form.register("newCustomerAddress")}
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

                {/* -----------------------------------------
                    CREATE BUTTON
                ------------------------------------------ */}

                <button
                  type="button"
                  onClick={handleCreateCustomer}
                  disabled={
                    !newCustomerName?.trim() || !newCustomerPhone?.trim()
                  }
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
                  Create Customer
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* =================================================
          ACTIONS
      ================================================== */}

      <div
        className="
          flex
          justify-end
          border-t
          border-slate-100
          pt-4
        "
      >
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
  );
}

/* =========================================================
   CUSTOMER PREVIEW
========================================================= */

function CustomerPreview({ customer }: { customer: Customer }) {
  return (
    <section
      className="
        mt-4
        max-w-xl
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
        <p
          className="
            text-sm
            font-bold
            text-slate-900
          "
        >
          {customer.name}
        </p>

        <div className="mt-2 space-y-1">
          {customer.phone && (
            <p
              className="
                text-xs
                text-slate-500
              "
            >
              Phone: {customer.phone}
            </p>
          )}

          {customer.email && (
            <p
              className="
                text-xs
                text-slate-500
              "
            >
              Email: {customer.email}
            </p>
          )}

          {customer.address && (
            <p
              className="
                text-xs
                text-slate-600
              "
            >
              Address: {customer.address}
            </p>
          )}

          {customer.tier && (
            <p
              className="
                text-xs
                text-slate-500
              "
            >
              Tier:{" "}
              <span
                className="
                  font-semibold
                  text-slate-700
                "
              >
                {customer.tier}
              </span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
