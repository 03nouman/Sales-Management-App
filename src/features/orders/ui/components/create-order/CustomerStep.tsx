import { useEffect, useId, useMemo, useRef, useState } from "react";

import { ChevronDown, Check, Search, UserPlus } from "lucide-react";

import type { UseFormReturn } from "react-hook-form";

import type {
  Customer,
  CreateCustomerPayload,
  CustomerTier,
} from "../../../../customers/types/customer.types";

import type {
  CustomerMode,
  CreateOrderFormValues,
} from "../../../hooks/useCreateOrder";

/* =========================================================
   PROPS
========================================================= */

type Props = {
  form: UseFormReturn<CreateOrderFormValues>;

  customers: Customer[];

  selectedCustomer: Customer | null;

  customerMode: CustomerMode;

  onCustomerModeChange: (mode: CustomerMode) => void;

  onSelectCustomer: (customerId: number) => void;

  onCreateCustomer: (data: CreateCustomerPayload) => Customer;

  onNext: () => void | Promise<void>;
};

/* =========================================================
   NEW CUSTOMER FORM
========================================================= */

type NewCustomerFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  tier: CustomerTier;
};

/* =========================================================
   COMPONENT
========================================================= */

export function CustomerStep({
  form,
  customers,
  selectedCustomer,
  customerMode,
  onCustomerModeChange,
  onSelectCustomer,
  onCreateCustomer,
  onNext,
}: Props) {
  /* =======================================================
     IDS
  ======================================================= */

  const searchId = useId();

  /* =======================================================
     EXISTING CUSTOMER SEARCH STATE
  ======================================================= */

  const [searchTerm, setSearchTerm] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  /* =======================================================
     NEW CUSTOMER STATE
  ======================================================= */

  const [newCustomer, setNewCustomer] = useState<NewCustomerFormValues>({
    name: "",
    phone: "",
    email: "",
    address: "",
    tier: "Regular",
  });

  const [newCustomerError, setNewCustomerError] = useState<string | null>(null);

  const [createdCustomer, setCreatedCustomer] = useState<Customer | null>(null);

  /* =======================================================
     SELECTED CUSTOMER FROM FORM
  ======================================================= */

  const selectedCustomerId = form.watch("customerId");

  /* =======================================================
     FILTER CUSTOMERS
     
     Search by:
       - Name
       - Phone
       - Email
  ======================================================= */

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = customer.name?.toLowerCase() ?? "";

      const phone = customer.phone?.toLowerCase() ?? "";

      const email = customer.email?.toLowerCase() ?? "";

      return (
        name.includes(normalizedSearch) ||
        phone.includes(normalizedSearch) ||
        email.includes(normalizedSearch)
      );
    });
  }, [customers, searchTerm]);

  /* =======================================================
     RESET HIGHLIGHT WHEN SEARCH RESULTS CHANGE
  ======================================================= */

  useEffect(() => {
    if (filteredCustomers.length === 0) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex(0);
  }, [filteredCustomers]);

  /* =======================================================
     CLOSE SEARCH WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!searchContainerRef.current) {
        return;
      }

      if (!searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  /* =======================================================
     SELECT CUSTOMER
  ======================================================= */

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer.id);
    setSearchTerm("");
    setIsSearchOpen(false);
    setHighlightedIndex(-1);
    setCreatedCustomer(null);
  };

  /* =======================================================
     SEARCH KEYBOARD NAVIGATION
     
     ↑ ArrowUp
     ↓ ArrowDown
     Enter
     Escape
  ======================================================= */

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isSearchOpen) {
        setIsSearchOpen(true);

        if (filteredCustomers.length > 0) {
          setHighlightedIndex(
            event.key === "ArrowDown" ? 0 : filteredCustomers.length - 1,
          );
        }

        return;
      }

      if (filteredCustomers.length === 0) {
        return;
      }

      setHighlightedIndex((currentIndex) => {
        if (event.key === "ArrowDown") {
          if (currentIndex >= filteredCustomers.length - 1) {
            return 0;
          }

          return currentIndex + 1;
        }

        if (currentIndex <= 0) {
          return filteredCustomers.length - 1;
        }

        return currentIndex - 1;
      });

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (
        isSearchOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < filteredCustomers.length
      ) {
        handleSelectCustomer(filteredCustomers[highlightedIndex]);
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      setIsSearchOpen(false);

      setHighlightedIndex(-1);
    }
  };

  /* =======================================================
     CUSTOMER MODE CHANGE
  ======================================================= */

  const handleCustomerModeChange = (mode: CustomerMode) => {
    setNewCustomerError(null);

    setSearchTerm("");

    setIsSearchOpen(false);

    setHighlightedIndex(-1);

    if (mode === "existing") {
      setCreatedCustomer(null);
    }

    onCustomerModeChange(mode);
  };

  /* =======================================================
     CREATE CUSTOMER
  ======================================================= */

  const handleCreateCustomer = () => {
    setNewCustomerError(null);

    const name = newCustomer.name.trim();

    const phone = newCustomer.phone.trim();

    const email = newCustomer.email.trim();

    const address = newCustomer.address.trim();

    /* -----------------------------------------------
       VALIDATION
    ------------------------------------------------ */

    if (!name) {
      setNewCustomerError("Customer name is required.");

      return;
    }

    if (!phone) {
      setNewCustomerError("Customer phone is required.");

      return;
    }

    /* -----------------------------------------------
       DUPLICATE PHONE
    ------------------------------------------------ */

    const existingCustomer = customers.find(
      (customer) => customer.phone.trim() === phone,
    );

    if (existingCustomer) {
      setNewCustomerError(
        "A customer with this phone number already exists. Please use the existing customer.",
      );

      return;
    }

    /* -----------------------------------------------
       PAYLOAD
    ------------------------------------------------ */

    const payload: CreateCustomerPayload = {
      name,
      phone,
      email: email || undefined,
      address: address || undefined,
      tier: newCustomer.tier,
    };

    try {
      const customer = onCreateCustomer(payload);

      /*
       * Keep new mode active.
       *
       * The form disappears because createdCustomer
       * now exists.
       */

      setCreatedCustomer(customer);

      /* ---------------------------------------------
         CLEAR FORM
      --------------------------------------------- */

      setNewCustomer({
        name: "",
        phone: "",
        email: "",
        address: "",
        tier: "Regular",
      });
    } catch (error) {
      setNewCustomerError(
        error instanceof Error ? error.message : "Unable to create customer.",
      );
    }
  };

  /* =======================================================
     CHANGE CUSTOMER AFTER CREATION
  ======================================================= */

  const handleCreateAnotherCustomer = () => {
    setCreatedCustomer(null);

    setNewCustomerError(null);
  };

  /* =======================================================
     CONTINUE
  ======================================================= */

  const handleContinue = async () => {
    await onNext();
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        void handleContinue();
      }}
      className="space-y-6"
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <section>
        <h3 className="text-base font-bold text-slate-900">Customer Details</h3>

        <p className="mt-1 text-xs text-slate-500">
          Select an existing customer or create a new customer for this order.
        </p>
      </section>

      {/* ===================================================
          MODE SWITCH
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
          onClick={() => handleCustomerModeChange("existing")}
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
          onClick={() => handleCustomerModeChange("new")}
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
                value={
                  isSearchOpen
                    ? searchTerm
                    : selectedCustomer
                      ? `${selectedCustomer.name}${
                          selectedCustomer.phone
                            ? ` — ${selectedCustomer.phone}`
                            : ""
                        }`
                      : searchTerm
                }
                onChange={(event) => {
                  setSearchTerm(event.target.value);

                  setIsSearchOpen(true);

                  setHighlightedIndex(0);

                  /*
                   * If user starts searching after
                   * having selected a customer, don't
                   * immediately change the selected
                   * customer.
                   *
                   * Selection happens only after
                   * choosing a result.
                   */
                }}
                onFocus={() => {
                  setIsSearchOpen(true);

                  if (filteredCustomers.length > 0) {
                    setHighlightedIndex(0);
                  }
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search by name or phone..."
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
                  filteredCustomers.map((customer, index) => {
                    const isHighlighted = index === highlightedIndex;

                    const isSelected = customer.id === selectedCustomerId;

                    return (
                      <button
                        key={customer.id}
                        id={`${searchId}-option-${index}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onMouseDown={(event) => {
                          /*
                           * Prevent input blur before
                           * the selection is processed.
                           */

                          event.preventDefault();
                        }}
                        onClick={() => handleSelectCustomer(customer)}
                        onMouseEnter={() => setHighlightedIndex(index)}
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
                            {customer.name}
                          </p>

                          <p
                            className="
                                mt-0.5
                                truncate
                                text-xs
                                text-slate-500
                              "
                          >
                            {customer.phone}

                            {customer.email ? ` • ${customer.email}` : ""}
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
              SELECTED CUSTOMER PREVIEW
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

                  <p className="mt-2 text-sm font-bold text-slate-900">
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
                  onClick={() => {
                    form.setValue("customerId", null, {
                      shouldValidate: false,
                      shouldDirty: true,
                    });

                    setSearchTerm("");

                    setIsSearchOpen(true);

                    setHighlightedIndex(filteredCustomers.length > 0 ? 0 : -1);
                  }}
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

                  <p className="mt-2 text-sm font-bold text-slate-900">
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

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCreateAnotherCustomer}
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
                <h4 className="text-sm font-bold text-slate-900">
                  Create New Customer
                </h4>

                <p className="mt-1 text-xs text-slate-500">
                  Customer details will be saved locally and available for
                  future orders.
                </p>
              </div>

              {/* ---------------------------------------
                  FIELDS
              ---------------------------------------- */}

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      setNewCustomer((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
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
                      setNewCustomer((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
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
                      setNewCustomer((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
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
                      setNewCustomer((current) => ({
                        ...current,
                        tier: event.target.value as CustomerTier,
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
                      setNewCustomer((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
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
                  CREATE BUTTON
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
