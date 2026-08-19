import { X } from "lucide-react";
import { useCreateOrder } from "../../../hooks/useCreateOrder";
import { CustomerStep } from "./CustomerStep";
import { OrderItemsStep } from "./OrderItemsStep";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function CreateOrderModal({ isOpen, onClose }: Props) {
  const order = useCreateOrder(onClose);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[95vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-2xl">
        <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#263c93]">
              Step {order.step} of 2
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Create New Order
            </h2>
          </div>

          <button
            type="button"
            onClick={order.resetForm}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {order.step === 1 ? (
            <CustomerStep
              form={order.form}
              customers={order.customers}
              selectedCustomer={order.selectedCustomer}
              onNext={order.goToItemsStep}
            />
          ) : (
            <OrderItemsStep
              form={order.form}
              products={order.products}
              selectedItems={order.selectedItems}
              subtotal={order.subtotal}
              total={order.total}
              remainingAmount={order.remainingAmount}
              paymentStatus={order.paymentStatus}
              onAddProduct={order.addItem}
              onIncrease={order.increaseQuantity}
              onDecrease={order.decreaseQuantity}
              onRemove={order.removeItem}
              onBack={order.goBack}
              onSubmit={order.submitOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}
