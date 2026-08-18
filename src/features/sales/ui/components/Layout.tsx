import type { ReactNode } from "react";
import { Bell, CircleHelp, LogOut, Menu, X } from "lucide-react";
import { useLayoutHooks } from "../../hooks/useNavigations";
import { getVisibleNavigation, normalizeRole } from "../../utils/helpers";
import { desktopNavItems, mobileNavItems } from "../../constants/navItems";
import DesktopNavItem from "./DesktopNavItems";
import DrawerNavItem from "./DrawerNavItem";
import MobileNavItem from "./MobileNavItem";
import { useAppSelector } from "../../../../app/hooks";

export function Layout({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const { isOpen, closeNavigation, toggleNavigation, handleLogout } =
    useLayoutHooks();

  const normalizedUserRole = normalizeRole(user?.role);
  
  const visibleNavItems = getVisibleNavigation(
    desktopNavItems,
    normalizedUserRole,
  );

  const visibleMobileNavItems = getVisibleNavigation(
    mobileNavItems,
    normalizedUserRole,
  );

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-slate-900">
      {/* =====================================================
          DESKTOP SIDEBAR

          >= 1024px
      ====================================================== */}

      <aside
        className="
          fixed inset-y-0 left-0 z-40
          hidden w-[230px]
          border-r border-[#e4e1ec]
          bg-[#faf9fd]
          lg:flex lg:flex-col
        "
      >
        {/* ---------------------------------------------------
            DESKTOP LOGO
        ---------------------------------------------------- */}

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

        {/* ---------------------------------------------------
            DESKTOP SCROLLABLE NAVIGATION
        ---------------------------------------------------- */}

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
            {visibleNavItems.map((item) => (
              <DesktopNavItem key={item.to} item={item} />
            ))}
          </nav>
        </div>

        {/* ---------------------------------------------------
            DESKTOP BOTTOM UTILITIES
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
              hover:text-slate-900
            "
          >
            <CircleHelp size={18} strokeWidth={1.8} />
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
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE / TABLET DRAWER BACKDROP
      ====================================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeNavigation}
          className="
            fixed inset-0 z-40
            bg-slate-950/35
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          MOBILE / TABLET DRAWER

          < 1024px
      ====================================================== */}

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

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          min-h-screen
          pb-[72px]
          lg:ml-[230px]
          lg:pb-0
        "
      >
        {/* ===================================================
            MOBILE / TABLET HEADER
        ==================================================== */}

        <header
          className="
            sticky top-0 z-30
            flex min-h-[58px]
            items-center
            border-b border-[#e5e2ed]
            bg-[#faf9fd]/95
            px-3
            backdrop-blur
            sm:px-5
            lg:min-h-[68px]
            lg:justify-between
            lg:px-7
          "
        >
          {/* -------------------------------------------------
              MOBILE / TABLET LEFT SIDE
          -------------------------------------------------- */}

          <div
            className="
              flex
              min-w-0
              flex-1
              items-center
              gap-2
              lg:hidden
            "
          >
            <button
              type="button"
              onClick={toggleNavigation}
              aria-label="Open navigation"
              className="
                grid h-9 w-9
                shrink-0
                place-items-center
                rounded-lg
                text-slate-700
                transition
                hover:bg-slate-100
              "
            >
              <Menu size={21} />
            </button>

            <h1
              className="
                truncate
                text-[21px]
                font-extrabold
                tracking-tight
                text-[#263c93]
              "
            >
              HardwarePro
            </h1>
          </div>

          {/* -------------------------------------------------
              DESKTOP Title
          -------------------------------------------------- */}
          <h1 className="text-xl font-medium text-[#263c93]">Hardware Shop</h1>
          {/* -------------------------------------------------
              HEADER RIGHT SIDE
          -------------------------------------------------- */}

          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-4
            "
          >
            {/* Notification */}

            <button
              type="button"
              aria-label="Notifications"
              className="
                relative
                grid h-9 w-9
                place-items-center
                rounded-lg
                text-slate-600
                transition
                hover:bg-slate-100
                lg:h-auto
                lg:w-auto
              "
            >
              <Bell size={20} strokeWidth={1.8} />

              <span
                className="
                  absolute
                  right-1.5 top-1.5
                  h-2 w-2
                  rounded-full
                  border border-white
                  bg-red-500
                  lg:-right-1
                  lg:-top-1
                "
              />
            </button>

            {/* Desktop user avatar */}

            <button
              type="button"
              onClick={handleLogout}
              title={`Logout ${user?.name ?? "User"}`}
              className="
                hidden
                h-9 w-9
                place-items-center
                rounded-full
                border border-[#ccd4e8]
                bg-[#e7ecf8]
                text-sm
                font-bold
                text-[#263c93]
                transition
                hover:ring-2
                hover:ring-[#d8dcfa]
                lg:grid
              "
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </button>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        ==================================================== */}

        <div
          className="
            mx-auto
            w-full
            max-w-[1800px]
            p-3
            sm:p-5
            md:p-6
            xl:p-8
          "
        >
          {children}
        </div>
      </main>

      {/* =====================================================
          MOBILE + TABLET BOTTOM NAVIGATION

          Mobile: < 640px
          Tablet: 640px - 1023px
          Desktop: >= 1024px hidden

          This intentionally uses lg:hidden.
      ====================================================== */}

      <nav
        className="
          fixed inset-x-0 bottom-0 z-30
          border-t border-[#dedbe7]
          bg-white/95
          px-1
          pb-[env(safe-area-inset-bottom)]
          shadow-[0_-4px_20px_rgba(30,30,70,0.08)]
          backdrop-blur
          lg:hidden
        "
      >
        <div
          className="
            mx-auto
            grid
            min-h-[68px]
            max-w-2xl
            grid-cols-5
          "
        >
          {visibleMobileNavItems.map((item) => (
            <MobileNavItem key={item.to} item={item} />
          ))}
        </div>
      </nav>
    </div>
  );
}
