import type { ComponentType } from "react";
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
} from "react-router-dom";
import { LoginPage } from "./features/auth/components/LoginPage";
import { UnauthorizedPage } from "./features/auth/components/UnauthorizedPage";
import {
  normalizeRole,
  rolePermissions,
  type Permission,
  type Role,
} from "./features/auth/permissions";
import { SalesLayout } from "./features/sales/components/SalesLayout";
import { DashboardPage } from "./features/sales/pages/DashboardPage";
import { ProductsPage } from "./features/sales/pages/ProductsPage";
import { SalesPage } from "./features/sales/pages/SalesPage";
import { ReturnsPage } from "./features/sales/pages/ReturnsPage";
import { CustomersPage } from "./features/sales/pages/CustomersPage";
import { SettingsPage } from "./features/sales/pages/SettingsPage";

type StoredAuth = {
  isAuthenticated: boolean;
  user: {
    role?: Role;
    permissions?: Permission[];
  } | null;
};

const requireAuth = (requiredPermissions?: Permission[]) => () => {
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

    const normalizedRole = normalizeRole(auth.user.role);
    const permissions =
      auth.user.permissions ?? rolePermissions[normalizedRole];

    if (
      requiredPermissions &&
      !requiredPermissions.every((permission) =>
        permissions.includes(permission),
      )
    ) {
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
  requiredPermissions: Permission[],
) => ({
  path,
  loader: requireAuth(requiredPermissions),
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
  withProtectedLayout("/", DashboardPage, ["dashboard.view"]),
  withProtectedLayout("/sales", SalesPage, ["sales.view"]),
  withProtectedLayout("/products", ProductsPage, ["products.view"]),
  withProtectedLayout("/orders", SalesPage, ["sales.view"]),
  withProtectedLayout("/returns", ReturnsPage, ["returns.view"]),
  withProtectedLayout("/customers", CustomersPage, ["customers.view"]),
  withProtectedLayout("/settings", SettingsPage, ["settings.manage"]),
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
