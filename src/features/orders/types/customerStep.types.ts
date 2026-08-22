import type { UseFormReturn } from "react-hook-form";
import type { CreateOrderFormValues } from "../hooks/useCreateOrder";
import type { CustomerMode } from "../../customers/types/customerMode.types";
import type { Customer } from "../../customers/types/customer.types";
import type { KeyboardEvent } from "react";

export type CustomerStepProps = {
  form: UseFormReturn<CreateOrderFormValues>;
  customerMode: CustomerMode;
  selectedCustomer: Customer | null;
  selectedCustomerId: number | null;
  /* Existing customer search */
  searchTerm: string;
  isSearchOpen: boolean;
  filteredCustomers: Customer[];
  highlightedIndex: number;
  /* New customer */
  newCustomer: NewCustomerFormValues;
  newCustomerError: string | null;
  createdCustomer: Customer | null;
  /* Customer mode */
  onCustomerModeChange: (mode: CustomerMode) => void;
  /* Existing customer */
  onSearchChange: (value: string) => void;
  onSearchFocus: () => void;
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSelectCustomer: (customerId: number) => void;
  onChangeSelectedCustomer: () => void;
  onCloseSearch: () => void;
  /* New customer */
  onUpdateNewCustomer: <K extends keyof NewCustomerFormValues>(
    field: K,
    value: NewCustomerFormValues[K],
  ) => void;
  onCreateCustomer: () => Customer | null;
  onCreateAnotherCustomer: () => void;
  /* Step */
  onNext: () => void | Promise<void>;
};

/* =========================================================
   NEW CUSTOMER TYPE
========================================================= */
export type NewCustomerFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  tier: "Regular" | "Silver" | "Gold";
};
