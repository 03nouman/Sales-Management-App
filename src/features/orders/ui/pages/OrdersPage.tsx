import { useEffect } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import { useOrders } from "../../hooks/useOrders";
import { CreateOrderModal } from "../components/create-order/CreateOrderModal";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import { OrdersHeader } from "../components/OrdersHeader";
import { OrdersList } from "../components/OrdersList";
import { OrdersToolbar } from "../components/OrdersToolbar";
import { loadLocalCustomers } from "../../../customers/state/customerSlice";

export function OrdersPage() {
  let dispatch = useAppDispatch();
  const orders = useOrders();

  useEffect(() => {
    dispatch(loadLocalCustomers());
  }, []);
  return (
    <div className="space-y-4 sm:space-y-5">
      <OrdersHeader onCreateOrder={orders.openCreateOrder} />

      <OrdersToolbar
        search={orders.search}
        onSearchChange={orders.setSearch}
        status={orders.status}
        onStatusChange={orders.setStatus}
      />

      <OrdersList
        orders={orders.filteredOrders}
        onViewOrder={(order) => orders.openOrderDetails(order.id)}
      />

      <OrderDetailsModal
        order={orders.selectedOrder}
        onClose={orders.closeOrderDetails}
      />

      <CreateOrderModal
        isOpen={orders.isCreateOrderOpen}
        onClose={orders.closeCreateOrder}
      />
    </div>
  );
}
