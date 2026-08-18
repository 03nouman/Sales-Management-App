import { CircleHelp, LogOut } from "lucide-react";
import type { NavItem } from "../../types/layout";
import DesktopNavItem from "./DesktopNavItems";

type DesktopSidebarProps = {
  navItems: NavItem[];
  onLogout: () => void;
};

export default function DesktopSidebar({
  navItems,
  onLogout,
}: DesktopSidebarProps) {
  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-40
        hidden w-[230px]
        border-r border-[#e4e1ec]
        bg-[#faf9fd]
        lg:flex lg:flex-col
      "
    >
      {/* Logo */}
      <div
        className="
          shrink-0
          border-b border-[#e8e5ef]
          px-6 py-5
        "
      >
        <h1
          className="
            text-[24px]
            font-extrabold
            tracking-tight
            text-[#263c93]
          "
        >
          HardwarePro
        </h1>

        <p
          className="
            mt-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.16em]
            text-slate-500
          "
        >
          Warehouse Admin
        </p>
      </div>

      {/* Navigation */}
      <div
        className="
          min-h-0
          flex-1
          overflow-y-auto
          px-3 py-7
          [scrollbar-color:#d5d2df_transparent]
          [scrollbar-width:thin]
        "
      >
        <nav className="space-y-1.5">
          {navItems.map((item) => (
            <DesktopNavItem key={item.to} item={item} />
          ))}
        </nav>
      </div>

      {/* Utilities */}
      <div
        className="
          shrink-0
          border-t border-[#e8e5ef]
          px-3 py-4
        "
      >
        <button
          type="button"
          className="
            flex w-full
            items-center gap-3
            rounded-xl
            px-4 py-3
            text-[13px]
            font-medium
            text-slate-600
            transition
            hover:bg-[#f0eef7]
            hover:text-slate-900
          "
        >
          <CircleHelp size={18} strokeWidth={1.8} />
          Support
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="
            mt-1
            flex w-full
            items-center gap-3
            rounded-xl
            px-4 py-3
            text-[13px]
            font-medium
            text-slate-600
            transition
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <LogOut size={18} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}
