import type { KeyboardEvent } from "react";

import type { Customer } from "../../../../../customers/types/customer.types";

import { CustomerSearch } from "./CustomerSearch";
import { SelectedCustomerCard } from "./SelectedCustomerCard";

type Props = {
  searchTerm: string;

  isSearchOpen: boolean;

  filteredCustomers: Customer[];

  highlightedIndex: number;

  selectedCustomerId: number | null;

  selectedCustomer: Customer | null;

  onSearchChange: (value: string) => void;

  onSearchFocus: () => void;

  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;

  onSelectCustomer: (customerId: number) => void;

  onChangeSelectedCustomer: () => void;

  onCloseSearch: () => void;
};

export function ExistingCustomerSection({
  searchTerm,
  isSearchOpen,
  filteredCustomers,
  highlightedIndex,
  selectedCustomerId,
  selectedCustomer,
  onSearchChange,
  onSearchFocus,
  onSearchKeyDown,
  onSelectCustomer,
  onChangeSelectedCustomer,
  onCloseSearch,
}: Props) {
  return (
    <section className="space-y-4">
      <CustomerSearch
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
        onCloseSearch={onCloseSearch}
      />

      {selectedCustomer && (
        <SelectedCustomerCard
          customer={selectedCustomer}
          onChangeSelectedCustomer={onChangeSelectedCustomer}
        />
      )}
    </section>
  );
}
