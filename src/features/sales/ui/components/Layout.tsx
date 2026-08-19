import type { ReactNode } from "react";
import { useAppSelector } from "../../../../app/hooks";
import { useLayoutHooks } from "../../hooks/useNavigations";
import DesktopSidebar from "./DesktopSidebar";
import MobileDrawer from "./MobileDrawer";
import MainContent from "./MainContent";
import MobileBottomNavigation from "./MobileBottomNavigation";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const user = useAppSelector((state) => state.auth.user);

  const {
    isOpen,
    closeNavigation,
    toggleNavigation,
    handleLogout,
    visibleNavItems,
    visibleMobileNavItems,
  } = useLayoutHooks();

  return (
    <div className="min-h-screen bg-[#f8f7fc] text-slate-900">
      <DesktopSidebar navItems={visibleNavItems} onLogout={handleLogout} />

      <MobileDrawer
        isOpen={isOpen}
        navItems={visibleNavItems}
        onClose={closeNavigation}
        onLogout={handleLogout}
      />

      <MainContent
        user={user}
        onOpenNavigation={toggleNavigation}
        onLogout={handleLogout}
      >
        {children}
      </MainContent>

      <MobileBottomNavigation navItems={visibleMobileNavItems} />
    </div>
  );
}
