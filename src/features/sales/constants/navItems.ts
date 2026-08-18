import {
  BarChart3,
  Grid2X2,
  Package,
  ReceiptText,
  RotateCcw,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";
import type { NavItem } from "../types/layout";

export const desktopNavItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    mobileLabel: "Home",
    icon: Grid2X2,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/products",
    label: "Inventory",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    to: "/sales",
    label: "Sales",
    icon: ReceiptText,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/orders",
    label: "Orders",
    icon: ShoppingCart,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/customers",
    label: "Customers",
    icon: Users,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/returns",
    label: "Returns & Exchanges",
    icon: RotateCcw,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/reports",
    label: "Reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
  {
    to: "/settings",
    label: "Settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export const mobileNavItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    mobileLabel: "Home",
    icon: Grid2X2,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/products",
    label: "Inventory",
    mobileLabel: "Inventory",
    icon: Package,
    roles: ["admin", "manager"],
  },
  {
    to: "/sales",
    label: "Sales",
    mobileLabel: "Sales",
    icon: ReceiptText,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/orders",
    label: "Orders",
    mobileLabel: "Orders",
    icon: ShoppingCart,
    roles: ["admin", "manager", "cashier"],
  },
  {
    to: "/reports",
    label: "Reports",
    mobileLabel: "Reports",
    icon: BarChart3,
    roles: ["admin", "manager"],
  },
];

