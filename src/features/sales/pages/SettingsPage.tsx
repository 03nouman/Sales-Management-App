export function SettingsPage() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Company profile</p>
          <p className="mt-2 font-semibold text-slate-800">
            SalesFlow Hardware Store
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Payment methods</p>
          <p className="mt-2 font-semibold text-slate-800">
            Cash, Bank transfer, Card
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">Return policy</p>
          <p className="mt-2 font-semibold text-slate-800">
            7-day exchange window
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm text-slate-500">User access</p>
          <p className="mt-2 font-semibold text-slate-800">
            Owner / Manager / Cashier
          </p>
        </div>
      </div>
    </div>
  );
}
