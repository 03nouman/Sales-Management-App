import { useAppSelector } from "../../../../app/hooks";

export function CustomersPage() {
  const customers = useAppSelector((state) => state.sales.customers);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-slate-800">{customer.name}</p>
                <p className="text-sm text-slate-500">{customer.email}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="rounded-full bg-violet-100 px-2 py-1 font-medium text-violet-700">
                  {customer.tier}
                </span>
                <span className="font-semibold text-slate-800">
                  Total spent: ${customer.totalSpent}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
