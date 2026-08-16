export function ReturnsPage() {
  const returnCases = [
    {
      id: "RET-2201",
      originalSale: "INV-1001",
      customer: "Rahim Ahmed",
      returnedValue: 1500,
      replacementSale: 999,
      settlement: 501,
      status: "Settlement pending",
    },
    {
      id: "RET-2202",
      originalSale: "INV-1007",
      customer: "Nadia Hasan",
      returnedValue: 850,
      replacementSale: 740,
      settlement: 110,
      status: "Settled",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">
          Returns & Exchanges
        </h1>
        <p className="mt-2 text-slate-600">
          Trace original sale, replacement sale, and final settlement for each
          case.
        </p>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-4">
          {returnCases.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-slate-500">Case {item.id}</p>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Original sale: {item.originalSale}
                  </h3>
                </div>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.status === "Settled" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {item.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <Detail label="Customer" value={item.customer} />
                <Detail
                  label="Returned value"
                  value={`৳${item.returnedValue}`}
                />
                <Detail
                  label="Replacement sale"
                  value={`৳${item.replacementSale}`}
                />
                <Detail label="Settlement" value={`৳${item.settlement}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 font-semibold text-slate-800">{value}</p>
    </div>
  );
}
