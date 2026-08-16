import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addOrder, addTransaction, type SaleTransaction } from "../salesSlice";
import { formatPrice } from "../../../lib/currency";

type SaleFormValues = {
  customer: string;
  item: string;
  qty: number;
  price: number;
  payment: number;
};

export function SalesPage() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector((state) => state.sales.transactions);
  const products = useAppSelector((state) => state.sales.products);
  const [search, setSearch] = useState("");

  const { register, handleSubmit, reset } = useForm<SaleFormValues>({
    defaultValues: {
      customer: "Rahim Ahmed",
      item: "Aluminium Rod 12mm",
      qty: 1,
      price: 5000,
      payment: 3500,
    },
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) =>
      `${txn.customer} ${txn.items.map((item) => item.name).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [search, transactions]);

  const onSubmit = (data: SaleFormValues) => {
    const product =
      products.find((item) => item.name === data.item) ?? products[0];
    const subtotal = Number(data.qty) * Number(data.price);
    const total = subtotal;
    const paid = Number(data.payment);
    const outstanding = Math.max(total - paid, 0);
    const returnedValue = 0;
    const exchangeValue = 0;
    const settlement = 0;
    const transaction: SaleTransaction = {
      id: `TXN-${Date.now()}`,
      customer: data.customer,
      items: [
        {
          productId: product.id,
          name: product.name,
          qty: Number(data.qty),
          price: Number(data.price),
        },
      ],
      subtotal,
      discount: 0,
      total,
      paid,
      outstanding,
      returnedValue,
      exchangeValue,
      settlement,
      status: outstanding > 0 ? "Partial" : "Completed",
      createdAt: new Date().toISOString(),
    };

    dispatch(addTransaction(transaction));
    dispatch(
      addOrder({
        id: `INV-${Date.now()}`,
        customer: data.customer,
        date: new Date().toISOString().slice(0, 10),
        item: product.name,
        total,
        paid,
        outstanding,
        status: outstanding > 0 ? "Partial" : "Paid",
      }),
    );
    reset();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
              Operations
            </p>
            <h1 className="mt-2 text-3xl font-black">
              Sales & Transaction Tracking
            </h1>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-2 text-sm text-slate-100">
            Return → Exchange → Settlement traceability
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            Create Invoice
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Customer
              </label>
              <input
                {...register("customer", { required: true })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Product
              </label>
              <select
                {...register("item", { required: true })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                {...register("qty", { required: true, valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Unit Price
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: true, valueAsNumber: true })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Received Payment
              </label>
              <input
                type="number"
                step="0.01"
                {...register("payment", {
                  required: true,
                  valueAsNumber: true,
                })}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Save Invoice
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Traceable Sales Flow
          </h3>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">1. Original Sale</p>
              <p className="mt-1">
                Invoice created with linked customer and item details.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">
                2. Return / Exchange
              </p>
              <p className="mt-1">
                Unused materials can be returned and exchanged for another
                purchase.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-semibold text-slate-800">3. Settlement</p>
              <p className="mt-1">
                Difference is reconciled as refund, credit, or outstanding
                balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Transaction Ledger
          </h2>
          <div className="flex w-full md:w-[60%] gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions or customer"
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500"
            />
            <select className="w-[40%] rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500">
              <option value="all">All status</option>
              <option value="completed">Completed</option>
              <option value="partial">Partial</option>
              <option value="return-pending">Return Pending</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Returned</th>
                <th className="px-4 py-3">Settlement</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {txn.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{txn.customer}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {txn.items
                      .map((item) => `${item.name} x${item.qty}`)
                      .join(", ")}
                  </td>
                  <td className="px-4 py-3">{formatPrice(txn.total)}</td>
                  <td className="px-4 py-3">
                    {formatPrice(txn.returnedValue)}
                  </td>
                  <td className="px-4 py-3">{formatPrice(txn.settlement)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${txn.status === "Completed" ? "bg-emerald-100 text-emerald-700" : txn.status === "Partial" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
