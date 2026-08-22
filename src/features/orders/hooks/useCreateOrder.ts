import { useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import { addOrderLocal } from "../state/ordersSlice";

import {
  setSelectedCustomer,
  clearSelectedCustomer,
} from "../../customers/state/customerSlice";

import type {
  Customer,
  CreateCustomerPayload,
} from "../../customers/types/customer.types";

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

import type { Product } from "../../products/types/product.type";

/* =========================================================
   CUSTOMER MODE
========================================================= */

export type CustomerMode = "existing" | "new";

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
     CUSTOMERS FROM REDUX
     
     Customer data is already managed by Redux/localStorage.
     No API request is made here.
  ======================================================= */

  const customers = useAppSelector((state) => state.customers.customers);

  const customersLoading = useAppSelector((state) => state.customers.isLoading);

  const customersError = useAppSelector((state) => state.customers.error);

  const selectedCustomerId = useAppSelector(
    (state) => state.customers.selectedCustomerId,
  );

  /* =======================================================
     PRODUCTS FROM REDUX
     
     Products are also managed by the products feature.
     No API request is made here.
  ======================================================= */

  const products = useAppSelector((state) => state.products.products);

  const productsLoading = useAppSelector((state) => state.products.isLoading);

  const productsError = useAppSelector((state) => state.products.error);

  /* =======================================================
     CUSTOMER MODE
  ======================================================= */

  const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");

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
     CATALOG STATE
  ======================================================= */

  const isCatalogLoading = customersLoading || productsLoading;

  const catalogError = customersError || productsError;

  /* =======================================================
     SELECTED CUSTOMER
  ======================================================= */

  const selectedCustomer = useMemo<Customer | null>(
    () =>
      customers.find(
        (customer) => Number(customer.id) === Number(selectedCustomerId),
      ) ?? null,
    [customers, selectedCustomerId],
  );

  /* =======================================================
     CUSTOMER SELECTION
  ======================================================= */

  const selectCustomer = (customerId: number) => {
    dispatch(setSelectedCustomer(customerId));

    form.setValue("customerId", customerId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* =======================================================
     CREATE CUSTOMER
     
     Demo/local mode:
       Redux → localStorage through customer state handling
  ======================================================= */

  const createCustomer = (data: CreateCustomerPayload) => {
    const existingCustomer = customers.find(
      (customer) => customer.phone === data.phone,
    );

    if (existingCustomer) {
      dispatch(setSelectedCustomer(existingCustomer.id));

      form.setValue("customerId", existingCustomer.id, {
        shouldValidate: true,
      });

      return existingCustomer;
    }

    const nextId =
      customers.length > 0
        ? Math.max(...customers.map((customer) => customer.id)) + 1
        : 1;

    const newCustomer: Customer = {
      id: nextId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      address: data.address?.trim() || undefined,
      tier: data.tier || "Regular",
    };

    dispatch({
      type: "customers/addCustomerLocal",
      payload: newCustomer,
    });

    dispatch(setSelectedCustomer(newCustomer.id));

    form.setValue("customerId", newCustomer.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    /*
     * Important:
     *
     * We intentionally DO NOT switch customerMode
     * back to "existing".
     *
     * The user remains in New Customer mode.
     * The new-customer form can hide and the newly
     * created customer can be displayed as selected.
     */

    return newCustomer;
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
    if (!selectedCustomer) {
      return;
    }

    if (selectedItems.length === 0) {
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

    dispatch(clearSelectedCustomer());

    setSelectedItems([]);

    setCustomerMode("existing");

    setStep(1);

    onClose();
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    form,

    step,

    customerMode,

    setCustomerMode,

    customers,

    selectedCustomer,

    selectedCustomerId,

    selectCustomer,

    createCustomer,

    products,

    isCatalogLoading,

    catalogError,

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

    goToItemsStep,

    goBack,

    submitOrder,

    resetForm,
  };
}
