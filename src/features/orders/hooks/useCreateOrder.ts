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
     CUSTOMERS
     
     Source:
       localStorage
          ↓
       customerSlice
          ↓
       Redux
     
     No API request is made here.
  ======================================================= */

  const customers = useAppSelector((state) => state.customers.customers);

  const customersLoading = useAppSelector((state) => state.customers.isLoading);

  const customersError = useAppSelector((state) => state.customers.error);

  const selectedCustomerId = useAppSelector(
    (state) => state.customers.selectedCustomerId,
  );

  /* =======================================================
     PRODUCTS
     
     Products come from the products Redux slice.
     The products slice currently contains demo data.
     
     No API request is made here.
  ======================================================= */

  const products = useAppSelector((state) => state.products.products);

  const productsLoading = useAppSelector((state) => state.products.isLoading);

  const productsError = useAppSelector((state) => state.products.error);

  /* =======================================================
     CUSTOMER MODE
  ======================================================= */

  const [customerMode, setCustomerModeState] =
    useState<CustomerMode>("existing");

  /* =======================================================
     STEP
  ======================================================= */

  const [step, setStep] = useState<1 | 2>(1);

  /* =======================================================
     SELECTED ORDER ITEMS
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
     
     This only represents Redux/local state.
     No API loading happens here.
  ======================================================= */

  const isCatalogLoading = customersLoading || productsLoading;

  const catalogError = customersError || productsError;

  /* =======================================================
     SELECTED CUSTOMER
  ======================================================= */

  const selectedCustomer = useMemo<Customer | null>(() => {
    if (selectedCustomerId === null) {
      return null;
    }

    return (
      customers.find(
        (customer) => Number(customer.id) === Number(selectedCustomerId),
      ) ?? null
    );
  }, [customers, selectedCustomerId]);

  /* =======================================================
     CUSTOMER MODE CHANGE
  ======================================================= */

  const setCustomerMode = (mode: CustomerMode) => {
    setCustomerModeState(mode);

    /*
     * When the user explicitly starts creating a new customer,
     * remove the existing customer from the current order.
     *
     * This keeps:
     *
     * customerMode
     * +
     * selectedCustomerId
     *
     * logically consistent.
     */

    if (mode === "new") {
      dispatch(clearSelectedCustomer());

      form.setValue("customerId", null, {
        shouldValidate: false,
        shouldDirty: true,
      });
    }
  };

  /* =======================================================
     SELECT EXISTING CUSTOMER
  ======================================================= */

  const selectCustomer = (customerId: number) => {
    const customerExists = customers.some(
      (customer) => customer.id === customerId,
    );

    if (!customerExists) {
      return;
    }

    dispatch(setSelectedCustomer(customerId));

    form.setValue("customerId", customerId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setCustomerModeState("existing");
  };

  /* =======================================================
     CREATE CUSTOMER
     
     Demo/local mode:
     
       CustomerStep
          ↓
       createCustomer()
          ↓
       customerSlice
          ↓
       localStorage + Redux
     
     The newly created customer remains selected.
     We intentionally DO NOT switch back to existing mode.
  ======================================================= */

  const createCustomer = (data: CreateCustomerPayload): Customer => {
    const name = data.name.trim();
    const phone = data.phone.trim();

    /*
     * Safety validation at business-logic level.
     * UI validation also exists inside CustomerStep.
     */

    if (!name || !phone) {
      throw new Error("Customer name and phone are required.");
    }

    /* =====================================================
       DUPLICATE PHONE CHECK
    ===================================================== */

    const existingCustomer = customers.find(
      (customer) => customer.phone.trim() === phone,
    );

    if (existingCustomer) {
      dispatch(setSelectedCustomer(existingCustomer.id));

      form.setValue("customerId", existingCustomer.id, {
        shouldValidate: true,
        shouldDirty: true,
      });

      /*
       * Keep current mode.
       *
       * CustomerStep can decide how to display the result.
       */

      return existingCustomer;
    }

    /* =====================================================
       GENERATE LOCAL ID
    ===================================================== */

    const nextId =
      customers.length > 0
        ? Math.max(...customers.map((customer) => customer.id)) + 1
        : 1;

    /* =====================================================
       NEW CUSTOMER
    ===================================================== */

    const newCustomer: Customer = {
      id: nextId,
      name,
      phone,
      email: data.email?.trim() || undefined,
      address: data.address?.trim() || undefined,
      tier: data.tier || "Regular",
    };

    /* =====================================================
       SAVE THROUGH REDUX
       
       customerSlice handles localStorage persistence.
    ===================================================== */

    dispatch({
      type: "customers/addCustomerLocal",
      payload: newCustomer,
    });

    /* =====================================================
       SELECT NEW CUSTOMER
    ===================================================== */

    dispatch(setSelectedCustomer(newCustomer.id));

    form.setValue("customerId", newCustomer.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    /*
     * IMPORTANT:
     *
     * We intentionally stay in "new" mode.
     *
     * CustomerStep will hide the creation form and show
     * the newly created customer as the selected customer.
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

      /* -----------------------------------------------
         PRODUCT ALREADY EXISTS
      ------------------------------------------------ */

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

      /* -----------------------------------------------
         NEW PRODUCT
      ------------------------------------------------ */

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

    if (!valid) {
      return;
    }

    if (selectedCustomerId === null) {
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

    /* ===================================================
         LOCAL DEMO ORDER
      =================================================== */

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

    setCustomerModeState("existing");

    setStep(1);

    onClose();
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    /* Form */
    form,

    /* Step */
    step,

    /* Customer */
    customerMode,
    setCustomerMode,

    customers,

    selectedCustomer,

    selectedCustomerId,

    selectCustomer,

    createCustomer,

    /* Products */
    products,

    /* Catalog */
    isCatalogLoading,
    catalogError,

    /* Order items */
    selectedItems,

    /* Calculations */
    subtotal,
    discount,
    tax,
    total,
    paidAmount,
    remainingAmount,
    paymentStatus,

    /* Product actions */
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,

    /* Navigation */
    goToItemsStep,
    goBack,

    /* Submit */
    submitOrder,

    /* Reset */
    resetForm,
  };
}
