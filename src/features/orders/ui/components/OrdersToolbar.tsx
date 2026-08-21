import type { OrderStatus } from "../../types/order.types";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  status: "all" | OrderStatus;
  onStatusChange: (value: "all" | OrderStatus) => void;
};

export function OrdersToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <section className="rounded-xl border border-[#ddd9e8] bg-white p-3 sm:p-4">
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr] lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
            Search
          </label>

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search order or customer..."
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#263c93]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
            Status
          </label>

          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as "all" | OrderStatus)
            }
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#263c93]"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Dispatched">Dispatched</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="hidden lg:block">
          <label className="mb-1.5 block text-[13px] font-medium text-slate-600">
            Date Range
          </label>

          <input
            type="date"
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[13px] outline-none focus:border-[#263c93]"
          />
        </div>
      </div>
    </section>
  );
}
