import type { NavItem } from "../../types/layout";
import MobileNavItem from "./MobileNavItem";

type MobileBottomNavigationProps = {
  navItems: NavItem[];
};

export default function MobileBottomNavigation({
  navItems,
}: MobileBottomNavigationProps) {
  return (
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
        {navItems.map((item) => (
          <MobileNavItem key={item.to} item={item} />
        ))}
      </div>
    </nav>
  );
}
