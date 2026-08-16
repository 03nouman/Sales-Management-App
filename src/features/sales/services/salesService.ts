import { salesApi } from "../api/salesApi";

export const salesService = {
  getDashboardStats: () => salesApi.getDashboardStats(),
  getProducts: () => salesApi.getProducts(),
  getOrders: () => salesApi.getOrders(),
};
