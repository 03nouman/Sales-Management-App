import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  DollarSign,
  Package,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  Users,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/sales", label: "Sales", icon: DollarSign },
  { to: "/products", label: "Products", icon: Package },
  { to: "/orders", label: "Orders", icon: ReceiptText },
  { to: "/returns", label: "Returns & Exchanges", icon: RotateCcw },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/settings", label: "Settings", icon: ShieldCheck },
];

export function SalesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed left-0 top-0 flex h-full w-72 flex-col bg-slate-950 p-6 text-white">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
            Hardware Shop
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">SalesFlow</h1>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Owner
          </p>
          <p className="mt-2 text-lg font-semibold">Noman Shah</p>
          <p className="text-sm text-slate-300">Main Branch</p>
        </div>
      </aside>

      <main className="ml-72 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
