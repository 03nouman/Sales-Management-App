import type { Customer } from "./customer.types";

export type CustomersState = {
  customers: Customer[];
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  selectedCustomerId: number | null;
};
