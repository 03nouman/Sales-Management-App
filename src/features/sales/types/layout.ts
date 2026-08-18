import type { BarChart3 } from "lucide-react";

export type Role = "admin" | "manager" | "cashier";

export type NavItem = {
  to: string;
  label: string;
  mobileLabel?: string;
  icon: typeof BarChart3;
  roles: Role[];
};
