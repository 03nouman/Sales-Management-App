import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  CircleHelp,
  Grid2X2,
  LogOut,
  Package,
  ReceiptText,
  RotateCcw,
  Settings,
  ShoppingCart,
  Users,
  Search,
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
    icon: Grid2X2,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/products",
    label: "Inventory",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    to: "/sales",
    label: "Sales",
    icon: ReceiptText,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/customers",
    label: "Customers",
    icon: Users,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/returns",
    label: "Returns & Exchanges",
    icon: RotateCcw,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function SalesLayout({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);

  const userRole = user?.role ?? "cashier";

  const normalizedUserRole: Role =
    userRole === "admin" || userRole === "manager" || userRole === "cashier"
      ? userRole
      : "cashier";

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(normalizedUserRole),
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-slate-900">
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[230px] border-r border-[#e4e1ec] bg-[#faf9fd] lg:flex lg:flex-col">
        {/* Logo */}
        <div className="shrink-0 border-b border-[#e8e5ef] px-6 py-5">
          <h1 className="text-[24px] font-extrabold tracking-tight text-[#263c93]">
            HardwarePro
          </h1>

          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Warehouse Admin
          </p>
        </div>

        {/* =================================================
            SCROLLABLE NAVIGATION
        ================================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-7 [scrollbar-width:thin] [scrollbar-color:#d5d2df_transparent]">
          <nav className="space-y-1.5">
            {visibleNavItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-3 rounded-xl",
                    "px-4 py-3",
                    "text-[13px] font-medium",
                    "transition-all duration-200",
                    isActive
                      ? "bg-[#eef0ff] font-semibold text-[#263c93]"
                      : "text-slate-600 hover:bg-[#f0eef7] hover:text-slate-900",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute right-0 top-1/2 h-[65%] w-[3px] -translate-y-1/2 rounded-l-full bg-[#263c93]" />
                    )}

                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={
                        isActive
                          ? "text-[#263c93]"
                          : "text-slate-500 group-hover:text-slate-800"
                      }
                    />

                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* =================================================
            BOTTOM UTILITY AREA

            Settings intentionally removed here because it
            already exists in the main navigation.
        ================================================== */}
        <div className="shrink-0 border-t border-[#e8e5ef] px-3 py-4">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-600 transition hover:bg-[#f0eef7] hover:text-slate-900"
          >
            <CircleHelp size={18} strokeWidth={1.8} />
            Support
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main className="min-h-screen lg:ml-[230px]">
        {/* =================================================
            TOP HEADER
        ================================================== */}
        <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between border-b border-[#e5e2ed] bg-[#faf9fd]/95 px-5 backdrop-blur sm:px-7">
          {/* Search */}
          <div className="flex h-10 w-full max-w-[410px] items-center rounded-xl border border-[#ddd9e8] bg-[#f2f0f8] px-3.5">
            <Search
              size={17}
              strokeWidth={1.8}
              className="shrink-0 text-[#52618e]"
            />

            <input
              type="text"
              placeholder="Search inventory, orders..."
              className="h-full w-full bg-transparent px-2.5 text-[13px] text-slate-700 outline-none placeholder:text-slate-500"
            />
          </div>

          {/* Header actions */}
          <div className="ml-5 flex items-center gap-5">
            <button
              type="button"
              className="relative text-slate-600 transition hover:text-slate-900"
            >
              <Bell size={20} strokeWidth={1.8} />

              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-white bg-red-500" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title={`Logout ${user?.name ?? "User"}`}
              className="grid h-9 w-9 place-items-center rounded-full border border-[#ccd4e8] bg-[#e7ecf8] text-sm font-bold text-[#263c93] transition hover:ring-2 hover:ring-[#d8dcfa]"
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </button>
          </div>
        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================== */}
        <div className="mx-auto w-full max-w-[1800px] p-5 sm:p-6 xl:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
