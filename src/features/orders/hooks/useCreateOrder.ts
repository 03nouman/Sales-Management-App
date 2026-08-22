import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { addOrderLocal } from "../state/ordersSlice";

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

import type { Product } from "../../products/types/product.type";

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
     CUSTOMER WORKFLOW
  ======================================================= */

  const customer = useCustomer();

  /* =======================================================
     PRODUCTS FROM REDUX
     
     No API request is made here.
  ======================================================= */

  const products = useAppSelector((state) => state.products.products);

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

  const paidAmount = Number(form.watch("paidAmount") || 0);

  /* =======================================================
     SYNC CUSTOMER WITH ORDER FORM
  ======================================================= */

  const selectCustomer = (customerId: number) => {
    customer.handleSelectCustomer(
      customer.customers.find((item) => item.id === customerId) ?? {
        id: customerId,
        name: "",
        phone: "",
      },
    );

    form.setValue("customerId", customerId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* =======================================================
     CREATE CUSTOMER
     
     Customer creation itself is handled by useCustomer.
  ======================================================= */

  const createCustomer = () => {
    const created = customer.createCustomer();

    if (!created) {
      return null;
    }

    form.setValue("customerId", created.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    return created;
  };

  /* =======================================================
     SELECTED CUSTOMER CLEAR
  ======================================================= */

  const clearCustomerSelection = () => {
    customer.changeCustomer();

    form.setValue("customerId", null, {
      shouldValidate: false,
      shouldDirty: true,
    });
  };

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

  const goToItemsStep = () => {
    if (!customer.selectedCustomerId) {
      return;
    }

    if (!customer.selectedCustomer) {
      return;
    }

    form.setValue("customerId", customer.selectedCustomerId, {
      shouldValidate: true,
      shouldDirty: true,
    });

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
    if (!customer.selectedCustomer) {
      return;
    }

    if (selectedItems.length === 0) {
      return;
    }

    const payload: CreateOrderPayload = {
      customerId: Number(customer.selectedCustomer.id),

      customerName: customer.selectedCustomer.name,

      customerPhone: customer.selectedCustomer.phone,

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

    const localOrder = {
      id: Date.now(),

      orderNumber: generateOrderNumber(),

      ...payload,

      createdAt: new Date().toISOString(),
    };

    dispatch(addOrderLocal(localOrder));

    resetForm();
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    form.reset();

    customer.resetCustomer();

    setSelectedItems([]);

    setStep(1);

    onClose();
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    /* -----------------------------------------------------
       ORDER FORM
    ----------------------------------------------------- */

    form,

    step,

    /* -----------------------------------------------------
       CUSTOMER
    ----------------------------------------------------- */

    customer,

    selectedCustomer: customer.selectedCustomer,

    selectedCustomerId: customer.selectedCustomerId,

    customerMode: customer.customerMode,

    setCustomerMode: customer.setCustomerMode,

    selectCustomer,

    clearCustomerSelection,

    createCustomer,

    /* -----------------------------------------------------
       PRODUCTS
    ----------------------------------------------------- */

    products,

    isCatalogLoading: false,

    catalogError: null,

    /* -----------------------------------------------------
       ORDER ITEMS
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       STEPS
    ----------------------------------------------------- */

    goToItemsStep,

    goBack,

    /* -----------------------------------------------------
       ORDER
    ----------------------------------------------------- */

    submitOrder,

    resetForm,
  };
}
