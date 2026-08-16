import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { UnauthorizedPage } from "./UnauthorizedPage";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: Array<"admin" | "manager" | "cashier">;
};

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const userRole = useAppSelector(
    (state) => state.auth.user?.role ?? "cashier",
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    !allowedRoles.includes(userRole as "admin" | "manager" | "cashier")
  ) {
    return <UnauthorizedPage />;
  }

  return <>{children}</>;
}
