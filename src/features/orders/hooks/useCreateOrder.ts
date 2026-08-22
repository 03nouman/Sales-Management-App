import { useMemo, useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addOrderLocal } from "../state/ordersSlice";
import { clearSelectedCustomer } from "../../customers/state/customerSlice";

import type {
  OrderItem,
  PaymentType,
  CreateOrderPayload,
} from "../types/order.types";

import {
  calculatePaymentStatus,
  calculateRemainingAmount,
  calculateSubtotal,
  calculateItemTotal,
  generateOrderNumber,
} from "../utils/orderHelpers";
import { useCustomer } from "../../customers/hooks/useCustomer";

/* =========================================================
   FORM TYPE
========================================================= */

export type CreateOrderFormValues = {
  customerId: number | null;
  deliveryDate: string;
  deliveryTime: string;
  paymentType: PaymentType;
  paidAmount: number;
  billingAddress: string;
  orderType: "Delivery" | "Pickup";
};

/* =========================================================
   HOOK
========================================================= */

export function useCreateOrder(onClose: () => void) {
  const dispatch = useAppDispatch();

  /* =======================================================
     CUSTOMER
  ======================================================= */

  const customer = useCustomer();

  /* =======================================================
     PRODUCTS
     
     Demo data comes from Redux.
     No API request is made here.
  ======================================================= */

  const products = useAppSelector((state) => state.products.products);

  /* =======================================================
     PRODUCT STATE
  ======================================================= */

  const productsLoading = useAppSelector((state) => state.products.isLoading);
  const productsError = useAppSelector((state) => state.products.error);

  /* =======================================================
     STEP
  ======================================================= */

  const [step, setStep] = useState<1 | 2>(1);

  /* =======================================================
     SELECTED ITEMS
  ======================================================= */

  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

  /* =======================================================
     FORM
  ======================================================= */

  const form = useForm<CreateOrderFormValues>({
    defaultValues: {
      customerId: null,
      deliveryDate: "",
      deliveryTime: "",
      paymentType: "Cash",
      paidAmount: 0,
      billingAddress: "",
      orderType: "Delivery",
    },
  });

  /* =======================================================
     SYNC CUSTOMER WITH ORDER FORM
  ======================================================= */

  const selectedCustomerId = customer.selectedCustomerId;
  const selectedCustomer = customer.selectedCustomer;

  /*
   * The customer hook owns customer selection.
   *
   * The order form needs the selected ID for
   * validation and final order submission.
   */

  useEffect(() => {
    const currentCustomerId = form.getValues("customerId");

    if (currentCustomerId !== selectedCustomerId) {
      form.setValue("customerId", selectedCustomerId, {
        shouldValidate: true,
      });
    }
  }, [form, selectedCustomerId]);

  /* =======================================================
     CATALOG STATE
  ======================================================= */

  const isCatalogLoading = productsLoading;

  const catalogError = productsError;

  /* =======================================================
     PAYMENT
  ======================================================= */

  const paidAmount = Number(form.watch("paidAmount") || 0);

  /* =======================================================
     ORDER CALCULATIONS
  ======================================================= */

  const subtotal = useMemo(
    () => calculateSubtotal(selectedItems),
    [selectedItems],
  );

  const discount = 0;

  const tax = 0;

  const total = subtotal - discount + tax;

  const remainingAmount = calculateRemainingAmount(total, paidAmount);

  const paymentStatus = calculatePaymentStatus(total, paidAmount);

  /* =======================================================
     ADD PRODUCT
  ======================================================= */

  const addItem = (productId: number) => {
    const product = products.find(
      (item) => Number(item.id) === Number(productId),
    );

    if (!product) {
      return;
    }

    if (product.stock <= 0) {
      return;
    }

    setSelectedItems((current) => {
      const existing = current.find((item) => item.productId === product.id);

      if (existing) {
        if (existing.quantity >= product.stock) {
          return current;
        }

        const quantity = existing.quantity + 1;

        return current.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity,
                total: calculateItemTotal(item.price, quantity),
              }
            : item,
        );
      }

      return [
        ...current,
        {
          productId: product.id,

          productName: product.name,

          sku: product.sku,

          quantity: 1,

          price: product.price,

          total: calculateItemTotal(product.price, 1),
        },
      ];
    });
  };

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (productId: number) => {
    const product = products.find(
      (item) => Number(item.id) === Number(productId),
    );

    if (!product) {
      return;
    }

    setSelectedItems((current) =>
      current.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        if (item.quantity >= product.stock) {
          return item;
        }

        const quantity = item.quantity + 1;

        return {
          ...item,
          quantity,
          total: calculateItemTotal(item.price, quantity),
        };
      }),
    );
  };

  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity = (productId: number) => {
    setSelectedItems((current) =>
      current
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          const quantity = item.quantity - 1;

          return {
            ...item,
            quantity,
            total: calculateItemTotal(item.price, quantity),
          };
        })
        .filter((item) => item.quantity > 0),
    );
  };

  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeItem = (productId: number) => {
    setSelectedItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
  };

  /* =======================================================
     STEP 1 → STEP 2
  ======================================================= */

  const goToItemsStep = async () => {
    const valid = await form.trigger("customerId");

    if (!valid || !selectedCustomerId) {
      return;
    }

    if (!selectedCustomer) {
      return;
    }

    setStep(2);
  };

  /* =======================================================
     BACK TO STEP 1
  ======================================================= */

  const goBack = () => {
    setStep(1);
  };

  /* =======================================================
     SUBMIT ORDER
  ======================================================= */

const submitOrder: SubmitHandler<CreateOrderFormValues> = async (data) => {
  // console.log("========== CREATE ORDER ==========");

  // console.log("Form data:", data);
  // console.log("Selected customer:", selectedCustomer);
  // console.log("Selected items:", selectedItems);

  if (!selectedCustomer) {
    console.error("CREATE ORDER STOPPED: No selected customer");
    return;
  }

  if (selectedItems.length === 0) {
    console.error("CREATE ORDER STOPPED: No selected items");
    return;
  }

  const payload: CreateOrderPayload = {
    customerId: Number(selectedCustomer.id),

    customerName: selectedCustomer.name,

    customerPhone: selectedCustomer.phone,

    items: selectedItems,

    subtotal,

    discount,

    tax,

    total,

    paidAmount,

    remainingAmount,

    paymentStatus,

    paymentType: data.paymentType,

    orderStatus: "Pending",

    orderType: data.orderType,

    billingAddress: data.billingAddress,

    deliveryDate: data.deliveryDate,

    deliveryTime: data.deliveryTime,
  };

  // console.log("Payload:", payload);

  const localOrder = {
    id: Date.now(),

    orderNumber: generateOrderNumber(),

    ...payload,

    createdAt: new Date().toISOString(),
  };

  console.log("Local order:", localOrder);

  dispatch(addOrderLocal(localOrder));

  console.log("Order dispatched successfully");

  resetForm();
};

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    form.reset();

    dispatch(clearSelectedCustomer());

    setSelectedItems([]);

    setStep(1);

    onClose();
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    form,

    step,

    /* CUSTOMER */

    customerMode: customer.customerMode,

    setCustomerMode: customer.changeCustomerMode,

    selectedCustomer: customer.selectedCustomer,

    selectedCustomerId: customer.selectedCustomerId,

    selectCustomer: customer.selectCustomer,

    createCustomer: customer.createCustomer,

    /* SEARCH */

    searchTerm: customer.searchTerm,

    isSearchOpen: customer.isSearchOpen,

    filteredCustomers: customer.filteredCustomers,

    highlightedIndex: customer.highlightedIndex,

    handleSearchChange: customer.handleSearchChange,

    handleSearchFocus: customer.handleSearchFocus,

    handleSearchKeyDown: customer.handleSearchKeyDown,

    closeSearch: customer.closeSearch,

    changeSelectedCustomer: customer.changeSelectedCustomer,

    /* NEW CUSTOMER */

    newCustomer: customer.newCustomer,

    newCustomerError: customer.newCustomerError,

    createdCustomer: customer.createdCustomer,

    updateNewCustomer: customer.updateNewCustomer,

    createAnotherCustomer: customer.createAnotherCustomer,

    /* PRODUCTS */

    products,

    isCatalogLoading,

    catalogError,

    /* ORDER ITEMS */

    selectedItems,

    subtotal,

    discount,

    tax,

    total,

    paidAmount,

    remainingAmount,

    paymentStatus,

    addItem,

    increaseQuantity,

    decreaseQuantity,

    removeItem,

    /* STEPS */

    goToItemsStep,

    goBack,

    submitOrder,

    resetForm,
  };
}
