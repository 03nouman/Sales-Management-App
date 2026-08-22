import type { KeyboardEvent } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { Customer } from "../../../../customers/types/customer.types";
import type { CustomerMode } from "../../../../customers/types/customerMode.types";
import type { NewCustomerFormValues } from "../../../../customers/hooks/useCustomer";

import type { CreateOrderFormValues } from "../../../hooks/useCreateOrder";

import { CustomerModeTabs } from "./customer-step-1/CustomerModeTabs";
import { ExistingCustomerSection } from "./customer-step-1/ExistingCustomerSection";
import { NewCustomerSection } from "./customer-step-1/NewCustomerSection";
import { CustomerStepActions } from "./customer-step-1/CustomerStepActions";

type Props = {
  form: UseFormReturn<CreateOrderFormValues>;

  customerMode: CustomerMode;

  selectedCustomer: Customer | null;

  searchTerm: string;

  isSearchOpen: boolean;

  filteredCustomers: Customer[];

  highlightedIndex: number;

  selectedCustomerId: number | null;

  newCustomer: NewCustomerFormValues;

  newCustomerError: string | null;

  createdCustomer: Customer | null;

  onCustomerModeChange: (mode: CustomerMode) => void;

  onSearchChange: (value: string) => void;

  onSearchFocus: () => void;

  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;

  onSelectCustomer: (customerId: number) => void;

  onChangeSelectedCustomer: () => void;

  onCloseSearch: () => void;

  onCreateCustomer: () => Customer | null;

  onCreateAnotherCustomer: () => void;

  onUpdateNewCustomer: <K extends keyof NewCustomerFormValues>(
    field: K,
    value: NewCustomerFormValues[K],
  ) => void;

  onNext: () => void | Promise<void>;
};

export function CustomerStep({
  customerMode,
  selectedCustomer,
  searchTerm,
  isSearchOpen,
  filteredCustomers,
  highlightedIndex,
  selectedCustomerId,
  newCustomer,
  newCustomerError,
  createdCustomer,
  onCustomerModeChange,
  onSearchChange,
  onSearchFocus,
  onSearchKeyDown,
  onSelectCustomer,
  onChangeSelectedCustomer,
  onCloseSearch,
  onCreateCustomer,
  onCreateAnotherCustomer,
  onUpdateNewCustomer,
  onNext,
}: Props) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        void onNext();
      }}
      className="space-y-6"
    >
      {/* HEADER */}

      <section>
        <h3 className="text-base font-bold text-slate-900">Customer Details</h3>

        <p className="mt-1 text-xs text-slate-500">
          Select an existing customer or create a new customer for this order.
        </p>
      </section>

      {/* CUSTOMER MODE */}

      <CustomerModeTabs
        customerMode={customerMode}
        onChange={onCustomerModeChange}
      />

      {/* EXISTING CUSTOMER */}

      {customerMode === "existing" && (
        <ExistingCustomerSection
          searchTerm={searchTerm}
          isSearchOpen={isSearchOpen}
          filteredCustomers={filteredCustomers}
          highlightedIndex={highlightedIndex}
          selectedCustomerId={selectedCustomerId}
          selectedCustomer={selectedCustomer}
          onSearchChange={onSearchChange}
          onSearchFocus={onSearchFocus}
          onSearchKeyDown={onSearchKeyDown}
          onSelectCustomer={onSelectCustomer}
          onChangeSelectedCustomer={onChangeSelectedCustomer}
          onCloseSearch={onCloseSearch}
        />
      )}

      {/* NEW CUSTOMER */}

      {customerMode === "new" && (
        <NewCustomerSection
          newCustomer={newCustomer}
          newCustomerError={newCustomerError}
          createdCustomer={createdCustomer}
          onUpdateNewCustomer={onUpdateNewCustomer}
          onCreateCustomer={onCreateCustomer}
          onCreateAnotherCustomer={onCreateAnotherCustomer}
        />
      )}

      {/* ACTIONS */}

      <CustomerStepActions selectedCustomer={selectedCustomer} />
    </form>
  );
}
