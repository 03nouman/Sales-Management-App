import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  LogOut,
  Package,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { logout } from "../../auth/state/authSlice";

type Role = "admin" | "manager" | "cashier";

const navItems: Array<{
  to: string;
  label: string;
  icon: typeof BarChart3;
  roles: Role[];
}> = [
  {
    to: "/",
    label: "Dashboard",
    icon: BarChart3,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/sales",
    label: "Sales",
    icon: ShoppingCart,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/products",
    label: "Products",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    to: "/orders",
    label: "Orders",
    icon: ReceiptText,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/returns",
    label: "Returns & Exchanges",
    icon: RotateCcw,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/customers",
    label: "Customers",
    icon: Users,
    roles: ["admin", "manager", "cashier"],
  },
  { to: "/settings", label: "Settings", icon: ShieldCheck, roles: ["admin"] },
];

const roleBadgeClasses: Record<Role, string> = {
  admin: "bg-blue-600 text-blue-50",
  manager: "bg-amber-500 text-amber-50",
  cashier: "bg-emerald-600 text-emerald-50",
};

export function SalesLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role ?? "cashier";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const normalizedUserRole: Role =
    userRole === "admin" || userRole === "manager" || userRole === "cashier"
      ? userRole
      : "cashier";

  const roleLabel = normalizedUserRole.toUpperCase();

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(normalizedUserRole),
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed left-0 top-0 flex h-full w-72 flex-col bg-slate-950 p-6 text-white">
        <div className="mb-6 shrink-0">
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
            Hardware Shop
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">SalesFlow</h1>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {visibleNavItems.map(({ to, label, icon: Icon }) => (
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

        <div className="mt-4 shrink-0 space-y-3 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-900/70 p-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                Logged in
              </p>
              <p className="truncate text-sm font-semibold text-white">
                {user?.name ?? "User"}
              </p>
            </div>
            <span
              className={`inline-flex rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] ${roleBadgeClasses[normalizedUserRole]}`}
            >
              {roleLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">
                Dashboard
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                {user?.name ?? "User"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left sm:text-right">
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                  Branch
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-700">
                  {user?.branch ?? "Main Branch"}
                </p>
              </div>
            </div>
          </header>

          {children}
        </div>
      </main>
    </div>
  );
}
