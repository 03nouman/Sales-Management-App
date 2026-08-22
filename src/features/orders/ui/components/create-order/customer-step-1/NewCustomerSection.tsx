import type { Customer } from "../../../../../customers/types/customer.types";
import type { NewCustomerFormValues } from "../../../../../customers/hooks/useCustomer";
import { CreatedCustomerCard } from "./CreatedCustomerCard";
import { NewCustomerForm } from "./NewCustomerForm";

type Props = {
  newCustomer: NewCustomerFormValues;
  newCustomerError: string | null;
  createdCustomer: Customer | null;
  onUpdateNewCustomer: <K extends keyof NewCustomerFormValues>(
    field: K,
    value: NewCustomerFormValues[K],
  ) => void;
  onCreateCustomer: () => Customer | null;
  onCreateAnotherCustomer: () => void;
};

export function NewCustomerSection({
  newCustomer,
  newCustomerError,
  createdCustomer,
  onUpdateNewCustomer,
  onCreateCustomer,
  onCreateAnotherCustomer,
}: Props) {
  return (
    <section className="max-w-2xl">
      {createdCustomer ? (
        <CreatedCustomerCard
          customer={createdCustomer}
          onCreateAnotherCustomer={onCreateAnotherCustomer}
        />
      ) : (
        <NewCustomerForm
          values={newCustomer}
          error={newCustomerError}
          onUpdate={onUpdateNewCustomer}
          onSubmit={onCreateCustomer}
        />
      )}
    </section>
  );
}
