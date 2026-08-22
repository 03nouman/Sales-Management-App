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
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-end
        justify-center
        bg-slate-950/45
        backdrop-blur-sm
        sm:items-center
        sm:p-4
      "
    >
      <div
        className="
          flex
          max-h-[95vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-2xl
          bg-white
          shadow-2xl
          sm:max-w-3xl
          sm:rounded-2xl
        "
      >
        {/* =================================================
            HEADER
        ================================================== */}

        <header
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-100
            px-5
            py-4
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-[#263c93]
              "
            >
              Step {order.step} of 2
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Create New Order
            </h2>
          </div>

          <button
            type="button"
            onClick={order.resetForm}
            aria-label="Close create order"
            className="
              grid
              h-9
              w-9
              place-items-center
              rounded-lg
              text-slate-600
              transition
              hover:bg-slate-100
              focus:outline-none
              focus:ring-2
              focus:ring-[#263c93]/20
            "
          >
            <X size={18} />
          </button>
        </header>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {/* =================================================
              CATALOG ERROR
          ================================================== */}

          {order.catalogError && (
            <div
              role="alert"
              className="
                mb-5
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-3
                text-sm
                text-red-700
              "
            >
              {order.catalogError}
            </div>
          )}

          {/* =================================================
              LOCAL DATA LOADING
              
              This is Redux/localStorage loading only.
              There is NO API request here.
          ================================================== */}

          {order.isCatalogLoading && (
            <div
              className="
                mb-5
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                px-4
                py-3
                text-sm
                text-slate-500
              "
            >
              Loading catalog...
            </div>
          )}

          {/* =================================================
              STEP 1 — CUSTOMER
          ================================================== */}

          {order.step === 1 && (
            <CustomerStep
              form={order.form}
              customers={order.customers}
              selectedCustomer={order.selectedCustomer}
              customerMode={order.customerMode}
              onCustomerModeChange={order.setCustomerMode}
              onSelectCustomer={order.selectCustomer}
              onCreateCustomer={order.createCustomer}
              onNext={order.goToItemsStep}
            />
          )}

          {/* =================================================
              STEP 2 — PRODUCTS
          ================================================== */}

          {order.step === 2 && (
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
