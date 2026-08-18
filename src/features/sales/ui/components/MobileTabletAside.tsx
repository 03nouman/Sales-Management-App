import { CircleHelp, LogOut, X } from "lucide-react";
import DrawerNavItem from "./DrawerNavItem";
import { getVisibleNavigation } from "../../utils/helpers";
import { desktopNavItems } from "../../constants/navItems";
import { useLayoutHooks } from "../../hooks/useNavigations";

const MobileTabletAside = () => {
  let {normalizedUserRole,handleLogout,closeNavigation,isOpen} = useLayoutHooks();
  const visibleNavItems = getVisibleNavigation(
    desktopNavItems,
    normalizedUserRole,
  );
  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-50",
        "flex w-[280px] flex-col",
        "border-r border-[#e4e1ec]",
        "bg-[#faf9fd]",
        "shadow-2xl",
        "transition-transform duration-300 ease-out",
        "lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      {/* ---------------------------------------------------
            DRAWER HEADER
        ---------------------------------------------------- */}

      <div
        className="
            flex shrink-0
            items-center justify-between
            border-b border-[#e8e5ef]
            px-5 py-4
          "
      >
        <div>
          <h1
            className="
                text-[22px]
                font-extrabold
                tracking-tight
                text-[#263c93]
              "
          >
            HardwarePro
          </h1>

          <p
            className="
                mt-0.5
                text-[9px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-slate-500
              "
          >
            Warehouse Admin
          </p>
        </div>

        <button
          type="button"
          onClick={closeNavigation}
          aria-label="Close menu"
          className="
              grid h-9 w-9
              place-items-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
            "
        >
          <X size={20} />
        </button>
      </div>

      {/* ---------------------------------------------------
            DRAWER NAVIGATION
        ---------------------------------------------------- */}

      <div
        className="
            min-h-0
            flex-1
            overflow-y-auto
            px-3 py-6
            [scrollbar-color:#d5d2df_transparent]
            [scrollbar-width:thin]
          "
      >
        <p
          className="
              mb-3 px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.16em]
              text-slate-400
            "
        >
          Navigation
        </p>

        <nav className="space-y-1.5">
          {visibleNavItems.map((item) => (
            <DrawerNavItem
              key={item.to}
              item={item}
              onNavigate={closeNavigation}
            />
          ))}
        </nav>
      </div>

      {/* ---------------------------------------------------
            DRAWER FOOTER
        ---------------------------------------------------- */}

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
            "
        >
          <CircleHelp size={18} />
          Support
        </button>

        <button
          type="button"
          onClick={handleLogout}
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
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default MobileTabletAside;
