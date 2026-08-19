import { useMemo, useState } from "react";

import { useAppSelector } from "../../../app/hooks";

import type { OrderStatus } from "../types/order.types";

export function useOrders() {
  const orders = useAppSelector((state) => state.orders.orders);

  const isLoading = useAppSelector((state) => state.orders.isLoading);

  const isUpdating = useAppSelector((state) => state.orders.isUpdating);

  const error = useAppSelector((state) => state.orders.error);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<"all" | OrderStatus>("all");

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query);

      const matchesStatus = status === "all" || order.orderStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, status]);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  );

  const stats = useMemo(
    () => ({
      total: orders.length,

      pending: orders.filter((order) => order.orderStatus === "Pending").length,

      processing: orders.filter((order) => order.orderStatus === "Processing")
        .length,

      dispatched: orders.filter((order) => order.orderStatus === "Dispatched")
        .length,

      completed: orders.filter((order) => order.orderStatus === "Completed")
        .length,

      pendingPayment: orders.filter(
        (order) =>
          order.paymentStatus === "Pending" ||
          order.paymentStatus === "Partially Paid",
      ).length,
    }),
    [orders],
  );

  const openCreateOrder = () => {
    setIsCreateOrderOpen(true);
  };

  const closeCreateOrder = () => {
    setIsCreateOrderOpen(false);
  };

  const openOrderDetails = (orderId: number) => {
    setSelectedOrderId(orderId);
  };

  const closeOrderDetails = () => {
    setSelectedOrderId(null);
  };

  return {
    orders,
    filteredOrders,
    selectedOrder,
    stats,
    isLoading,
    isUpdating,
    error,
    search,
    setSearch,
    status,
    setStatus,
    isCreateOrderOpen,
    openCreateOrder,
    closeCreateOrder,
    openOrderDetails,
    closeOrderDetails,
  };
}
