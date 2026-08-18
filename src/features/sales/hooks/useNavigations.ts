import { useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "../../auth/state/authSlice";

export function useLayoutHooks() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const openNavigation = () => {
    setIsOpen(true);
  };

  const closeNavigation = () => {
    setIsOpen(false);
  };

  const toggleNavigation = () => {
    setIsOpen((current: any) => !current);
  };

  const handleLogout = () => {
    dispatch(logout());

    closeNavigation();

    navigate("/login");
  };
  return {
    isOpen,
    openNavigation,
    closeNavigation,
    toggleNavigation,
    handleLogout,
  };
}
