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
import { Layout } from "./features/sales/ui/components/Layout";
import { DashboardPage } from "./features/sales/ui/pages/DashboardPage";
import { SalesPage } from "./features/sales/ui/pages/SalesPage";
import { ReturnsPage } from "./features/sales/ui/pages/ReturnsPage";
import { CustomersPage } from "./features/sales/ui/pages/CustomersPage";
import { SettingsPage } from "./features/sales/ui/pages/SettingsPage";
import { ProductsPage } from "./features/products/ui/pages/ProductsPage";

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
    <Layout>
      <Component />
    </Layout>
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
