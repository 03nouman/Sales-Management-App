import { NavLink } from "react-router-dom";
import type { NavItem } from "../../types/layout";

const MobileNavItem = ({ item }: { item: NavItem }) => {
  const { to, label, mobileLabel, icon: Icon } = item;

  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "relative",
          "flex min-h-[68px]",
          "flex-col",
          "items-center",
          "justify-center",
          "gap-1",
          "px-1",
          "text-[10px]",
          "font-medium",
          "transition-colors",
          isActive ? "text-[#263c93]" : "text-slate-500 hover:text-slate-800",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {/* Active pill */}

          <div
            className={[
              "grid h-8 min-w-8 place-items-center rounded-xl",
              "transition-all duration-200",
              isActive
                ? "bg-[#eef0ff] text-[#263c93]"
                : "bg-transparent text-slate-500",
            ].join(" ")}
          >
            <Icon size={19} strokeWidth={isActive ? 2.3 : 1.8} />
          </div>

          <span>{mobileLabel ?? label}</span>
        </>
      )}
    </NavLink>
  );
};

export default MobileNavItem;
