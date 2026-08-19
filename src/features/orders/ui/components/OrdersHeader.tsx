import { Filter, Plus } from "lucide-react";

type Props = {
  onCreateOrder: () => void;
};

export function OrdersHeader({ onCreateOrder }: Props) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-slate-950 sm:text-[28px]">
          Order Management
        </h1>

        <p className="mt-1 text-[12px] text-slate-500 sm:text-[13px]">
          Track customer orders, fulfillment and payments.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-[12px] font-semibold text-slate-700"
        >
          <Filter size={14} />
          Filter
        </button>

        <button
          type="button"
          onClick={onCreateOrder}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#263c93] px-4 text-[12px] font-semibold text-white transition hover:bg-[#1e3078]"
        >
          <Plus size={15} />
          Create Order
        </button>
      </div>
    </section>
  );
}
