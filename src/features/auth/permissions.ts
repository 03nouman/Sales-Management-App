export type Role = "admin" | "manager" | "cashier";

export type Permission =
  | "dashboard.view"
  | "sales.view"
  | "sales.create"
  | "orders.view"
  | "orders.create"
  | "products.view"
  | "products.manage"
  | "customers.view"
  | "returns.view"
  | "settings.manage";

export const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "dashboard.view",
    "sales.view",
    "orders.view",
    "orders.create",
    "products.view",
    "products.manage",
    "customers.view",
    "returns.view",
    "settings.manage",
  ],
  manager: [
    "dashboard.view",
    "sales.view",
    "orders.view",
    "orders.create",
    "products.view",
    "products.manage",
    "customers.view",
    "returns.view",
  ],
  cashier: [
    "dashboard.view",
    "sales.view",
    "orders.view",
    "orders.create",
    "customers.view",
    "returns.view",
  ],
};

export const hasPermission = (
  permissions: Permission[] | undefined,
  permission: Permission,
) => permissions?.includes(permission) ?? false;

export const normalizeRole = (role: string | undefined): Role => {
  if (role === "admin" || role === "manager" || role === "cashier") {
    return role;
  }

  return "cashier";
};
