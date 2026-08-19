import { useOrders } from "../../hooks/useOrders";
import { CreateOrderModal } from "../components/create-order/CreateOrderModal";
import { OrderDetailsModal } from "../components/OrderDetailsModal";
import { OrdersHeader } from "../components/OrdersHeader";
import { OrdersList } from "../components/OrdersList";
import { OrdersToolbar } from "../components/OrdersToolbar";


export function OrdersPage() {
  const orders = useOrders();

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
        onViewOrder={orders.setSelectedOrder}
      />

      <OrderDetailsModal
        order={orders.selectedOrder}
        onClose={() => orders.setSelectedOrder(null)}
      />

      <CreateOrderModal
        isOpen={orders.isCreateOrderOpen}
        onClose={orders.closeCreateOrder}
      />
    </div>
  );
}
