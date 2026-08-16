import {
  ArrowUpRight,
  Boxes,
  CreditCard,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { salesService } from "../services/salesService";
import { formatCurrency } from "../../../lib/currency";

export function DashboardPage() {
  const { dashboard, products, orders, customers } = useAppSelector(
    (state) => state.sales,
  );
  const [stats, setStats] = useState(dashboard);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      try {
        const data = await salesService.getDashboardStats();
        if (isActive) {
          setStats(data);
          setError(null);
        }
      } catch {
        if (isActive) {
          setError("Unable to load dashboard data. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  const activeStats = stats ?? dashboard;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
              Business snapshot
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              Hardware sales performance
            </h1>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-100">
            Gross margin visibility with return-to-exchange traceability
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-3xl bg-slate-200 ring-1 ring-slate-200"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Gross Sales"
            value={formatCurrency(activeStats.grossSales)}
            change="+12.4%"
            icon={<DollarSign className="text-emerald-500" />}
          />
          <StatCard
            title="Net Sales"
            value={formatCurrency(activeStats.netSales)}
            change="+9.1%"
            icon={<TrendingUp className="text-blue-500" />}
          />
          <StatCard
            title="Returns"
            value={formatCurrency(activeStats.returns)}
            change="-2.4%"
            icon={<CreditCard className="text-amber-500" />}
          />
          <StatCard
            title="Gross Profit"
            value={formatCurrency(activeStats.grossProfit)}
            change="+18.5%"
            icon={<Boxes className="text-violet-500" />}
          />
          <StatCard
            title="Return Impact"
            value={formatCurrency(activeStats.returnExchangeImpact)}
            change="+6.2%"
            icon={<Users className="text-pink-500" />}
          />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Sales trend</h2>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
              +14.2% vs last month
            </span>
          </div>
          <div className="grid grid-cols-7 items-end gap-3">
            {[35, 48, 40, 63, 58, 76, 92].map((value, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-blue-600 to-indigo-400"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-slate-500">
                  {["M", "T", "W", "T", "F", "S", "S"][index]}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Operational insight
          </h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <InsightRow
              label="Open orders"
              value={String(orders.filter((o) => o.status !== "Paid").length)}
            />
            <InsightRow
              label="Low stock items"
              value={String(
                products.filter((p) => p.status === "Low Stock").length,
              )}
            />
            <InsightRow
              label="Gold customers"
              value={String(customers.filter((c) => c.tier === "Gold").length)}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-slate-500">{title}</span>
        <span className="rounded-full bg-slate-100 p-2">{icon}</span>
      </div>
      <div className="flex flex-col items-start justify-between gap-2">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
          <ArrowUpRight size={16} />
          {change}
        </span>
      </div>
    </div>
  );
}

function InsightRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-slate-600">{label}</span>
      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
