import {
  ArrowUpRight,
  CircleAlert,
  CircleDollarSign,
  FileBarChart,
  Package,
  Plus,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../../../app/hooks";
import { salesService } from "../../services/salesService";
import { formatCurrency } from "../../../../lib/currency";

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

  const lowStockCount = products.filter(
    (product) => product.status === "Low Stock",
  ).length;

  return (
    <div className="space-y-6">
      {/* =====================================================
          ERROR STATE
      ====================================================== */}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* =====================================================
          TOP STAT CARDS
      ====================================================== */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[132px] animate-pulse rounded-2xl border border-[#e5e2ed] bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {/* Total Sales */}
          <DashboardStatCard
            title="Total Sales"
            value={formatCurrency(activeStats.grossSales)}
            change="+12.5% vs last week"
            icon={<CircleDollarSign size={19} />}
            iconClass="bg-[#eef0ff] text-[#263c93]"
            borderClass="border-t-[#263c93]"
            positive
          />

          {/* Active Orders */}
          <DashboardStatCard
            title="Active Orders"
            value={String(orders.length)}
            change={`${
              orders.filter((order) => order.status !== "Paid").length
            } pending dispatch`}
            icon={<ShoppingCart size={19} />}
            iconClass="bg-[#eef0ff] text-[#263c93]"
            borderClass="border-t-[#4b55d9]"
          />

          {/* Low Stock */}
          <DashboardStatCard
            title="Low Stock Alerts"
            value={String(lowStockCount)}
            change="Action required"
            icon={<CircleAlert size={19} />}
            iconClass="bg-[#fff2e8] text-[#c65b21]"
            borderClass="border-t-[#f16c24]"
            warning
          />

          {/* New Customers */}
          <DashboardStatCard
            title="New Customers"
            value={String(customers.length)}
            change="Steady growth"
            icon={<UserPlus size={19} />}
            iconClass="bg-[#f1f2f8] text-slate-700"
            borderClass="border-t-slate-700"
          />
        </div>
      )}

      {/* =====================================================
          REVENUE OVERVIEW + QUICK ACTIONS
      ====================================================== */}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
        {/* =================================================
            REVENUE OVERVIEW
        ================================================== */}
        <section className="overflow-hidden rounded-2xl border border-[#e4e1ec] bg-white">
          {/* Header */}
          <div className="flex min-h-[64px] items-center justify-between border-b border-[#ece9f1] px-5">
            <div>
              <h2 className="text-[18px] font-semibold text-slate-900">
                Revenue Overview
              </h2>
            </div>

            <button
              type="button"
              className="text-[11px] font-semibold uppercase tracking-wide text-[#263c93] transition hover:text-[#1d2d76]"
            >
              This Week
              <span className="ml-1.5">⌄</span>
            </button>
          </div>

          {/* Chart placeholder */}
          <div className="relative h-[340px] overflow-hidden bg-[#fdfcff]">
            {/* Horizontal grid lines */}
            <div className="absolute inset-0">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="absolute left-0 right-0 border-t border-[#f1eef6]"
                  style={{
                    top: `${line * 25}%`,
                  }}
                />
              ))}
            </div>

            {/* Vertical grid lines */}
            <div className="absolute inset-0 grid grid-cols-7">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className="border-r border-[#f4f1f7]" />
              ))}
            </div>

            {/* Existing placeholder */}
            <div className="relative z-10 flex h-full items-center justify-center">
              <span className="font-mono text-[11px] text-[#263c93]">
                [Chart Visualization Placeholder]
              </span>
            </div>
          </div>
        </section>

        {/* =================================================
            QUICK ACTIONS
        ================================================== */}
        <section className="rounded-2xl border border-[#e4e1ec] bg-white p-5">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Quick Actions
          </h2>

          <div className="mt-5 space-y-3">
            {/* New Sale */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#934b17] text-[12px] font-bold uppercase tracking-wide text-white transition hover:bg-[#7f3f11]"
            >
              <Plus size={16} />
              New Sale
            </button>

            {/* Add Product */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#303895] text-[12px] font-bold uppercase tracking-wide text-white transition hover:bg-[#252e80]"
            >
              <Package size={16} />
              Add Product
            </button>

            {/* Generate Report */}
            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#6d76ce] bg-white text-[12px] font-bold uppercase tracking-wide text-[#263c93] transition hover:bg-[#f3f4ff]"
            >
              <FileBarChart size={16} />
              Generate Report
            </button>
          </div>

          {/* System Alert */}
          <div className="mt-5 rounded-xl bg-[#f8dcd8] p-4">
            <div className="flex items-start gap-3">
              <CircleAlert size={17} className="mt-0.5 shrink-0 text-red-500" />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600">
                  System Alert
                </p>

                <p className="mt-1.5 text-[11px] leading-5 text-red-700">
                  Warehouse B humidity levels above threshold. Check
                  immediately.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          RECENT INVENTORY ACTIVITY
      ====================================================== */}
      <section className="overflow-hidden rounded-2xl border border-[#e4e1ec] bg-white">
        {/* Header */}
        <div className="flex min-h-[64px] items-center justify-between border-b border-[#ece9f1] px-5">
          <h2 className="text-[18px] font-semibold text-slate-900">
            Recent Inventory Activity
          </h2>

          <button
            type="button"
            className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#263c93] transition hover:text-[#1d2d76]"
          >
            View All
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-[#ece9f1] bg-[#fdfcff]">
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-[#263c93]">
                  Product Name
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-[#263c93]">
                  SKU
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-[#263c93]">
                  Category
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wide text-[#263c93]">
                  Stock Level
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wide text-[#263c93]">
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              {products.slice(0, 5).map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-[#f0edf4] last:border-0 transition hover:bg-[#faf9fd]"
                >
                  {/* Product */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-[11px] font-medium text-[#263c93]">
                      {product.name}
                    </span>
                  </td>

                  {/* SKU */}
                  <td className="px-5 py-4">
                    <span className="font-mono text-[10px] text-slate-600">
                      {product.sku}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4">
                    <span className="text-[11px] text-slate-700">
                      {product.category}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-5 py-4">
                    <StockBadge status={product.status} />
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono text-[11px] font-medium text-slate-900">
                      {formatCurrency(product.price)}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Empty State */}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-sm text-slate-500"
                  >
                    No inventory activity available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   DASHBOARD STAT CARD
========================================================= */

function DashboardStatCard({
  title,
  value,
  change,
  icon,
  iconClass,
  borderClass,
  positive = false,
  warning = false,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  iconClass: string;
  borderClass: string;
  positive?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl",
        "border border-[#e4e1ec]",
        "border-t-[3px]",
        "bg-white",
        "px-5 py-5",
        "shadow-[0_2px_10px_rgba(30,30,70,0.025)]",
        borderClass,
      ].join(" ")}
    >
      {/* Card top */}
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#263c93]">
          {title}
        </p>

        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${iconClass}`}
        >
          {icon}
        </span>
      </div>

      {/* Value */}
      <p className="mt-5 text-[28px] font-black leading-none tracking-tight text-slate-950">
        {value}
      </p>

      {/* Change */}
      <div
        className={[
          "mt-3 flex items-center gap-1.5",
          "text-[11px] font-medium",
          warning ? "text-red-600" : "text-slate-600",
        ].join(" ")}
      >
        {positive ? (
          <ArrowUpRight size={13} />
        ) : warning ? (
          <CircleAlert size={13} />
        ) : (
          <span>↳</span>
        )}

        {change}
      </div>
    </div>
  );
}

/* =========================================================
   STOCK BADGE
========================================================= */

function StockBadge({ status }: { status: string }) {
  const isLowStock = status === "Low Stock";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5",
        "rounded-md px-2.5 py-1.5",
        "text-[10px] font-semibold",
        isLowStock
          ? "bg-[#f9dfcf] text-[#9a4615]"
          : "bg-[#e8ebff] text-[#263c93]",
      ].join(" ")}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isLowStock ? "bg-[#c65b21]" : "bg-[#5265d5]"
        }`}
      />

      {isLowStock ? "Low Stock" : status || "In Stock"}
    </span>
  );
}
