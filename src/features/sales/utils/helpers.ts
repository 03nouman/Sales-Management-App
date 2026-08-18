import type { NavItem, Role } from "../types/layout";


export function normalizeRole(role: string | undefined): Role {
  if (role === "admin" || role === "manager" || role === "cashier") {
    return role;
  }

  return "cashier";
}

export function getVisibleNavigation(items: NavItem[], role: Role): NavItem[] {
  return items.filter((item) => item.roles.includes(role));
}