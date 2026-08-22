import { useState } from "react";
import { Check, ChevronDown, Search, UserPlus } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { CreateOrderFormValues } from "../../../hooks/useCreateOrder";
import type {
  Customer,
  CreateCustomerPayload,
  CustomerTier,
} from "../../../../customers/types/customer.types";
import type { CustomerMode } from "../../../hooks/useCreateOrder";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import type { RootState } from "../../../../../app/store";

type Props = {
  form: UseFormReturn<CreateOrderFormValues>;
  selectedCustomer: Customer | null;
  selectedCustomerId: number | null;
  customerMode: CustomerMode;
  onModeChange: (mode: CustomerMode) => void;
  onSelectCustomer: (customerId: number) => void;
  onCreateCustomer: (data: CreateCustomerPayload) => Customer | undefined;
  onNext: () => void;
};

export function CustomerStep({
  selectedCustomer,
  selectedCustomerId,
  customerMode,
  onModeChange,
  onSelectCustomer,
  onCreateCustomer,
  onNext,
}: Props) {
  let { customers } = useAppSelector((state: RootState) => state.customers);

  /* =====================================================
     SEARCH STATE
  ====================================================== */

  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  /* =====================================================
     NEW CUSTOMER STATE
  ====================================================== */

  const [showNewCustomerForm, setShowNewCustomerForm] = useState(true);

  const [newCustomer, setNewCustomer] = useState<CreateCustomerPayload>({
    name: "",
    phone: "",
    email: "",
    address: "",
    tier: "Regular",
  });

  const [newCustomerError, setNewCustomerError] = useState("");

  /* =====================================================
     SEARCH RESULTS
  ====================================================== */

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCustomers = customers.filter((customer) => {
    if (!normalizedSearch) {
      return false;
    }

    const nameMatch = customer.name.toLowerCase().includes(normalizedSearch);

    const phoneMatch = customer.phone.toLowerCase().includes(normalizedSearch);

    return nameMatch || phoneMatch;
  });

  /* =====================================================
     SELECT EXISTING CUSTOMER
  ====================================================== */

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer.id);

    setSearch(customer.name);

    setIsSearchOpen(false);
  };

  /* =====================================================
     SWITCH TO EXISTING
  ====================================================== */

  const handleExistingMode = () => {
    onModeChange("existing");

    setSearch("");

    setIsSearchOpen(false);

    setShowNewCustomerForm(false);
  };

  /* =====================================================
     SWITCH TO NEW
  ====================================================== */

  const handleNewMode = () => {
    onModeChange("new");

    setSearch("");

    setIsSearchOpen(false);

    setShowNewCustomerForm(true);

    setNewCustomerError("");
  };

  /* =====================================================
     NEW CUSTOMER INPUT
  ====================================================== */

  const updateNewCustomer = (
    field: keyof CreateCustomerPayload,
    value: string,
  ) => {
    setNewCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* =====================================================
     CREATE NEW CUSTOMER
  ====================================================== */

  const handleCreateCustomer = () => {
    setNewCustomerError("");

    if (!newCustomer.name.trim()) {
      setNewCustomerError("Customer name is required.");

      return;
    }

    if (!newCustomer.phone.trim()) {
      setNewCustomerError("Customer phone is required.");

      return;
    }

    const existingCustomer = customers.find(
      (customer) => customer.phone.trim() === newCustomer.phone.trim(),
    );

    if (existingCustomer) {
      setNewCustomerError("A customer with this phone number already exists.");

      return;
    }

    const createdCustomer = onCreateCustomer({
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      email: newCustomer.email?.trim() || undefined,
      address: newCustomer.address?.trim() || undefined,
      tier: newCustomer.tier || "Regular",
    });

    if (!createdCustomer) {
      return;
    }

    /*
     * Hide the form after successful creation.
     *
     * IMPORTANT:
     * We DO NOT switch customerMode back to
     * "existing".
     *
     * The mode remains "new".
     */

    setShowNewCustomerForm(false);

    setNewCustomerError("");
  };

  /* =====================================================
     RENDER
  ====================================================== */

  return (
    <div className="space-y-6">
      {/* =================================================
          HEADER
      ================================================== */}

      <section>
        <h3 className="text-base font-bold text-slate-900">Select Customer</h3>

        <p className="mt-1 text-xs text-slate-500">
          Select an existing customer or create a new customer before adding
          products.
        </p>
      </section>

      {/* =================================================
          MODE SWITCH
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
          onClick={handleExistingMode}
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
          onClick={handleNewMode}
          className={`
            flex
            items-center
            gap-1.5
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
          <UserPlus size={14} />
          New Customer
        </button>
      </div>

      {/* =================================================
          EXISTING CUSTOMER
      ================================================== */}

      {customerMode === "existing" && (
        <section className="space-y-4">
          <div>
            <label
              htmlFor="customerSearch"
              className="
                mb-1.5
                block
                text-xs
                font-semibold
                text-slate-700
              "
            >
              Search Customer
            </label>

            <div className="relative w-full max-w-96">
              <div
                className="
                  flex
                  h-11
                  items-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  transition
                  focus-within:border-[#263c93]
                  focus-within:ring-2
                  focus-within:ring-[#263c93]/10
                "
              >
                <Search size={17} className="ml-3 shrink-0 text-slate-400" />

                <input
                  id="customerSearch"
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);

                    setIsSearchOpen(true);
                  }}
                  onFocus={() => {
                    if (search.trim()) {
                      setIsSearchOpen(true);
                    }
                  }}
                  placeholder="Search by name or phone..."
                  className="
                    h-full
                    min-w-0
                    flex-1
                    bg-transparent
                    px-3
                    text-sm
                    outline-none
                    placeholder:text-slate-400
                  "
                />

                <ChevronDown
                  size={17}
                  className="
                    mr-3
                    shrink-0
                    text-slate-400
                  "
                />
              </div>

              {/* =================================================
                  SEARCH RESULTS
              ================================================== */}

              {isSearchOpen && normalizedSearch && (
                <div
                  className="
                      absolute
                      left-0
                      right-0
                      top-[calc(100%+6px)]
                      z-30
                      max-h-64
                      overflow-y-auto
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      p-1
                      shadow-xl
                    "
                >
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => {
                      const isSelected =
                        Number(selectedCustomerId) === Number(customer.id);

                      return (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleSelectCustomer(customer)}
                          className="
                                flex
                                w-full
                                items-center
                                justify-between
                                rounded-lg
                                px-3
                                py-2.5
                                text-left
                                transition
                                hover:bg-slate-50
                              "
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {customer.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {customer.phone}
                            </p>
                          </div>

                          <div className="ml-3 flex shrink-0 items-center gap-2">
                            {customer.tier && (
                              <span
                                className="
                                      rounded-full
                                      bg-slate-100
                                      px-2
                                      py-1
                                      text-[10px]
                                      font-semibold
                                      text-slate-600
                                    "
                              >
                                {customer.tier}
                              </span>
                            )}

                            {isSelected && (
                              <Check size={16} className="text-[#263c93]" />
                            )}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm font-medium text-slate-600">
                        No customer found
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Try another name or phone number.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              SELECTED CUSTOMER
          ================================================== */}

          {selectedCustomer && (
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
                <div>
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

                  <p className="mt-1.5 text-sm font-bold text-slate-900">
                    {selectedCustomer.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");

                    setIsSearchOpen(false);
                  }}
                  className="
                    text-xs
                    font-semibold
                    text-[#263c93]
                    hover:underline
                  "
                >
                  Change
                </button>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-xs text-slate-500">
                  Phone: {selectedCustomer.phone}
                </p>

                {selectedCustomer.email && (
                  <p className="text-xs text-slate-500">
                    Email: {selectedCustomer.email}
                  </p>
                )}

                {selectedCustomer.address && (
                  <p className="text-xs text-slate-600">
                    Address: {selectedCustomer.address}
                  </p>
                )}

                {selectedCustomer.tier && (
                  <p className="text-xs text-slate-500">
                    Tier:{" "}
                    <span className="font-semibold text-slate-700">
                      {selectedCustomer.tier}
                    </span>
                  </p>
                )}
              </div>
            </section>
          )}

          {/* {!selectedCustomer && (
            <p className="text-xs text-slate-400">
              Search and select a customer to continue.
            </p>
          )} */}
        </section>
      )}

      {/* =================================================
          NEW CUSTOMER
      ================================================== */}

      {customerMode === "new" && (
        <section className="space-y-4">
          {/* =================================================
              NEW CUSTOMER FORM
          ================================================== */}

          {showNewCustomerForm && (
            <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-5">
                <h4 className="text-sm font-bold text-slate-900">
                  Create New Customer
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  Add customer details before creating the order.
                </p>
              </div>

              <div className="space-y-4">
                {/* NAME + PHONE */}

                <div className="grid gap-4 sm:grid-cols-2">
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
                      Name
                    </label>

                    <input
                      id="newCustomerName"
                      type="text"
                      value={newCustomer.name}
                      onChange={(event) =>
                        updateNewCustomer("name", event.target.value)
                      }
                      placeholder="Customer name"
                      className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
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
                    </label>

                    <input
                      id="newCustomerPhone"
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(event) =>
                        updateNewCustomer("phone", event.target.value)
                      }
                      placeholder="Phone number"
                      className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
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
                </div>

                {/* EMAIL + TIER */}

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
                      value={newCustomer.email}
                      onChange={(event) =>
                        updateNewCustomer("email", event.target.value)
                      }
                      placeholder="Email address"
                      className="
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-200
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
                      value={newCustomer.tier}
                      onChange={(event) =>
                        updateNewCustomer(
                          "tier",
                          event.target.value as CustomerTier,
                        )
                      }
                      className="
                        h-10
                        w-full
                        rounded-lg
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

                {/* ADDRESS */}

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
                    value={newCustomer.address}
                    onChange={(event) =>
                      updateNewCustomer("address", event.target.value)
                    }
                    placeholder="Customer address"
                    rows={3}
                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-slate-200
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

                {/* ERROR */}

                {newCustomerError && (
                  <p className="text-xs text-red-500">{newCustomerError}</p>
                )}

                {/* CREATE */}

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleCreateCustomer}
                    className="
                      rounded-lg
                      bg-[#263c93]
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:bg-[#1f317d]
                    "
                  >
                    Create Customer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              CREATED CUSTOMER
          ================================================== */}

          {!showNewCustomerForm && selectedCustomer && (
            <section
              className="
                  max-w-xl
                  rounded-xl
                  border
                  border-emerald-200
                  bg-emerald-50
                  p-4
                "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                      grid
                      h-8
                      w-8
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-emerald-100
                      text-emerald-600
                    "
                >
                  <Check size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                    Customer Created
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {selectedCustomer.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedCustomer.phone}
                  </p>

                  {selectedCustomer.tier && (
                    <p className="mt-1 text-xs text-slate-500">
                      Tier:{" "}
                      <span className="font-semibold text-slate-700">
                        {selectedCustomer.tier}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </section>
          )}
        </section>
      )}

      {/* =================================================
          ACTIONS
      ================================================== */}

      <div className="flex justify-end border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onNext}
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
    </div>
  );
}
