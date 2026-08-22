import type { Customer } from "../../../../../customers/types/customer.types";

type Props = {
  selectedCustomer: Customer | null;
};

export function CustomerStepActions({ selectedCustomer }: Props) {
  return (
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
  );
}
