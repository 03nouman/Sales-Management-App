import { Check, ChevronDown, Search, UserPlus } from "lucide-react";

import type {
  Customer,
  CustomerTier,
} from "../../../../customers/types/customer.types";

import type { CustomerMode } from "../../../../customers/types/customerMode.types";

import type { useCustomer } from "../../../../customers/hooks/useCustomer";

/* =========================================================
   PROPS
========================================================= */

type CustomerController = ReturnType<typeof useCustomer>;

type Props = {
  customer: CustomerController;

  selectedCustomer: Customer | null;

  customerMode: CustomerMode;

  onCustomerModeChange: (mode: CustomerMode) => void;

  onSelectCustomer: (customerId: number) => void;

  onCreateCustomer: () => Customer | null;

  onChangeCustomer: () => void;

  onNext: () => void;
};

/* =========================================================
   COMPONENT
========================================================= */

export function CustomerStep({
  customer,
  selectedCustomer,
  customerMode,
  onCustomerModeChange,
  onSelectCustomer,
  onCreateCustomer,
  onChangeCustomer,
  onNext,
}: Props) {
  const {
    searchId,
    searchTerm,
    isSearchOpen,
    highlightedIndex,
    filteredCustomers,
    searchContainerRef,
    setSearchTerm,
    openCustomerSearch,
    handleSearchKeyDown,

    newCustomer,
    updateNewCustomer,
    newCustomerError,
    createdCustomer,
    createAnotherCustomer,
  } = customer;

  /* =======================================================
     SELECT CUSTOMER
  ======================================================= */

  const handleSelectCustomer = (customerId: number) => {
    onSelectCustomer(customerId);
  };

  /* =======================================================
     CREATE CUSTOMER
  ======================================================= */

  const handleCreateCustomer = () => {
    onCreateCustomer();
  };

  /* =======================================================
     CONTINUE
  ======================================================= */

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ===================================================
          HEADER
      ==================================================== */}

      <section>
        <h3
          className="
            text-base
            font-bold
            text-slate-900
          "
        >
          Customer Details
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

      {/* ===================================================
          CUSTOMER MODE
      ==================================================== */}

      <div
        className="
          flex
          w-fit
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          p-1
        "
        role="tablist"
        aria-label="Customer type"
      >
        <button
          type="button"
          role="tab"
          aria-selected={customerMode === "existing"}
          onClick={() => onCustomerModeChange("existing")}
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
          role="tab"
          aria-selected={customerMode === "new"}
          onClick={() => onCustomerModeChange("new")}
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

      {/* ===================================================
          EXISTING CUSTOMER
      ==================================================== */}

      {customerMode === "existing" && (
        <section className="space-y-4">
          <div ref={searchContainerRef} className="relative max-w-xl">
            <label
              htmlFor={searchId}
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

            {/* -------------------------------------------
                SEARCH INPUT
            -------------------------------------------- */}

            <div className="relative">
              <Search
                size={16}
                className="
                  pointer-events-none
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                id={searchId}
                type="text"
                role="combobox"
                aria-expanded={isSearchOpen}
                aria-controls={`${searchId}-listbox`}
                aria-autocomplete="list"
                aria-activedescendant={
                  highlightedIndex >= 0
                    ? `${searchId}-option-${highlightedIndex}`
                    : undefined
                }
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onFocus={openCustomerSearch}
                onKeyDown={handleSearchKeyDown}
                placeholder={
                  selectedCustomer
                    ? `${selectedCustomer.name} — ${selectedCustomer.phone}`
                    : "Search by name or phone..."
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-9
                  pr-10
                  text-sm
                  outline-none
                  transition
                  focus:border-[#263c93]
                  focus:ring-2
                  focus:ring-[#263c93]/10
                "
              />

              <ChevronDown
                size={16}
                className={`
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  transition
                  ${isSearchOpen ? "rotate-180" : ""}
                `}
              />
            </div>

            {/* -------------------------------------------
                SEARCH RESULTS
            -------------------------------------------- */}

            {isSearchOpen && (
              <div
                id={`${searchId}-listbox`}
                role="listbox"
                className="
                  absolute
                  left-0
                  right-0
                  top-full
                  z-50
                  mt-2
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
                {filteredCustomers.length === 0 ? (
                  <div
                    className="
                      px-3
                      py-4
                      text-center
                      text-xs
                      text-slate-500
                    "
                  >
                    No customers found.
                  </div>
                ) : (
                  filteredCustomers.map((currentCustomer, index) => {
                    const isHighlighted = index === highlightedIndex;

                    const isSelected =
                      currentCustomer.id === customer.selectedCustomerId;

                    return (
                      <button
                        key={currentCustomer.id}
                        id={`${searchId}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseDown={(event) => {
                          event.preventDefault();
                        }}
                        onClick={() => handleSelectCustomer(currentCustomer.id)}
                        className={`
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            transition
                            ${
                              isHighlighted
                                ? "bg-[#f1f3ff]"
                                : "hover:bg-slate-50"
                            }
                          `}
                      >
                        <div className="min-w-0">
                          <p
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-slate-800
                              "
                          >
                            {currentCustomer.name}
                          </p>

                          <p
                            className="
                                mt-0.5
                                truncate
                                text-xs
                                text-slate-500
                              "
                          >
                            {currentCustomer.phone}

                            {currentCustomer.email
                              ? ` • ${currentCustomer.email}`
                              : ""}
                          </p>
                        </div>

                        {isSelected && (
                          <Check
                            size={16}
                            className="
                                shrink-0
                                text-[#263c93]
                              "
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* -------------------------------------------
              SELECTED CUSTOMER
          -------------------------------------------- */}

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

                  <p
                    className="
                      mt-2
                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    {selectedCustomer.name}
                  </p>

                  <div className="mt-2 space-y-1">
                    {selectedCustomer.phone && (
                      <p className="text-xs text-slate-500">
                        Phone: {selectedCustomer.phone}
                      </p>
                    )}

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
                </div>

                <button
                  type="button"
                  onClick={onChangeCustomer}
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
          )}
        </section>
      )}

      {/* ===================================================
          NEW CUSTOMER
      ==================================================== */}

      {customerMode === "new" && (
        <section className="max-w-2xl">
          {/* -------------------------------------------
              CREATED CUSTOMER
          -------------------------------------------- */}

          {createdCustomer ? (
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
                <div>
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

                  <p
                    className="
                      mt-2
                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    {createdCustomer.name}
                  </p>

                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-slate-600">
                      Phone: {createdCustomer.phone}
                    </p>

                    {createdCustomer.email && (
                      <p className="text-xs text-slate-600">
                        Email: {createdCustomer.email}
                      </p>
                    )}

                    {createdCustomer.address && (
                      <p className="text-xs text-slate-600">
                        Address: {createdCustomer.address}
                      </p>
                    )}

                    {createdCustomer.tier && (
                      <p className="text-xs text-slate-600">
                        Tier:{" "}
                        <span className="font-semibold">
                          {createdCustomer.tier}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                <Check
                  size={20}
                  className="
                    shrink-0
                    text-emerald-600
                  "
                />
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={createAnotherCustomer}
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
          ) : (
            /* -----------------------------------------
               NEW CUSTOMER FORM
            ------------------------------------------ */

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
                  Customer details will be saved locally and available for
                  future orders.
                </p>
              </div>

              {/* ---------------------------------------
                  FIELDS
              ---------------------------------------- */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >
                {/* NAME */}

                <div>
                  <label
                    htmlFor="new-customer-name"
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
                    id="new-customer-name"
                    type="text"
                    value={newCustomer.name}
                    onChange={(event) =>
                      updateNewCustomer("name", event.target.value)
                    }
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

                {/* PHONE */}

                <div>
                  <label
                    htmlFor="new-customer-phone"
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
                    id="new-customer-phone"
                    type="tel"
                    value={newCustomer.phone}
                    onChange={(event) =>
                      updateNewCustomer("phone", event.target.value)
                    }
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

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="new-customer-email"
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
                    id="new-customer-email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(event) =>
                      updateNewCustomer("email", event.target.value)
                    }
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

                {/* TIER */}

                <div>
                  <label
                    htmlFor="new-customer-tier"
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
                    id="new-customer-tier"
                    value={newCustomer.tier}
                    onChange={(event) =>
                      updateNewCustomer(
                        "tier",
                        event.target.value as CustomerTier,
                      )
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

                {/* ADDRESS */}

                <div className="sm:col-span-2">
                  <label
                    htmlFor="new-customer-address"
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
                    id="new-customer-address"
                    value={newCustomer.address}
                    onChange={(event) =>
                      updateNewCustomer("address", event.target.value)
                    }
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

              {/* ---------------------------------------
                  ERROR
              ---------------------------------------- */}

              {newCustomerError && (
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
                  {newCustomerError}
                </div>
              )}

              {/* ---------------------------------------
                  CREATE
              ---------------------------------------- */}

              <button
                type="button"
                onClick={handleCreateCustomer}
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
          )}
        </section>
      )}

      {/* ===================================================
          ACTIONS
      ==================================================== */}

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
