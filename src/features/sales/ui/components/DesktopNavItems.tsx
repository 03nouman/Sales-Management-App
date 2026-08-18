import { NavLink } from "react-router-dom";
import type { NavItem } from "../../types/layout";

const DesktopNavItem = ({ item }: { item: NavItem }) => {
  const { to, label, icon: Icon } = item;

  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "group relative flex items-center gap-3",
          "rounded-xl px-4 py-3",
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
            <span
              className="
                absolute
                right-0
                top-1/2
                h-[65%]
                w-[3px]
                -translate-y-1/2
                rounded-l-full
                bg-[#263c93]
              "
            />
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
  );
};

export default DesktopNavItem;
