import type { ComponentType } from "react";
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from "./features/auth/components/LoginPage";
import { UnauthorizedPage } from "./features/auth/components/UnauthorizedPage";
import { SalesLayout } from "./features/sales/components/SalesLayout";
import { DashboardPage } from "./features/sales/pages/DashboardPage";
import { ProductsPage } from "./features/sales/pages/ProductsPage";
import { SalesPage } from "./features/sales/pages/SalesPage";
import { ReturnsPage } from "./features/sales/pages/ReturnsPage";
import { CustomersPage } from "./features/sales/pages/CustomersPage";
import { SettingsPage } from "./features/sales/pages/SettingsPage";

type Role = "admin" | "manager" | "cashier";

type StoredAuth = {
  isAuthenticated: boolean;
  user: {
    role?: Role;
  } | null;
};

const requireAuth = (allowedRoles?: Role[]) => () => {
  if (typeof window === "undefined") {
    return redirect("/login");
  }

  const stored = localStorage.getItem("salesflow-auth");

  if (!stored) {
    return redirect("/login");
  }

  try {
    const auth = JSON.parse(stored) as StoredAuth;

    if (!auth.isAuthenticated || !auth.user) {
      return redirect("/login");
    }

    if (allowedRoles && !allowedRoles.includes(auth.user.role as Role)) {
      return redirect("/unauthorized");
    }

    return null;
  } catch {
    return redirect("/login");
  }
};

const withProtectedLayout = (
  path: string,
  Component: ComponentType,
  allowedRoles: Role[],
) => ({
  path,
  loader: requireAuth(allowedRoles),
  element: (
    <SalesLayout>
      <Component />
    </SalesLayout>
  ),
});

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  withProtectedLayout("/", DashboardPage, ["admin", "manager", "cashier"]),
  withProtectedLayout("/sales", SalesPage, ["admin", "manager", "cashier"]),
  withProtectedLayout("/products", ProductsPage, ["admin", "manager"]),
  withProtectedLayout("/orders", SalesPage, ["admin", "manager", "cashier"]),
  withProtectedLayout("/returns", ReturnsPage, ["admin", "manager", "cashier"]),
  withProtectedLayout("/customers", CustomersPage, [
    "admin",
    "manager",
    "cashier",
  ]),
  withProtectedLayout("/settings", SettingsPage, ["admin"]),
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
