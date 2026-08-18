import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/state/authSlice";
import { getVisibleNavigation, normalizeRole } from "../utils/helpers";
import { desktopNavItems, mobileNavItems } from "../constants/navItems";

export function useLayoutHooks() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const normalizedUserRole = normalizeRole(user?.role);

  const openNavigation = () => {
    console.log("side-nav-open");
    setIsOpen(true);
  };

  const closeNavigation = () => {
    setIsOpen(false);
  };

  const toggleNavigation = () => {
    // console.log("toggled-triggered");
    setIsOpen((current: any) => !current);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeNavigation();
    navigate("/login");
  };

  const visibleNavItems = getVisibleNavigation(
    desktopNavItems,
    normalizedUserRole,
  );

  const visibleMobileNavItems = getVisibleNavigation(
    mobileNavItems,
    normalizedUserRole,
  );

  return {
    isOpen,
    openNavigation,
    closeNavigation,
    toggleNavigation,
    handleLogout,
    normalizedUserRole,
    user,
    visibleNavItems,
    visibleMobileNavItems,
  };
}
