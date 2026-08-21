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

import type { Customer } from "../../customers/types/customer.types";

import {
  addCustomerLocal,
  setSelectedCustomer,
} from "../../customers/state/customerSlice";

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

  /* New customer fields */

  newCustomerName: string;

  newCustomerPhone: string;

  newCustomerEmail: string;

  newCustomerAddress: string;

  newCustomerTier: Customer["tier"];
};

/* =========================================================
   CUSTOMER MODE
========================================================= */

export type CustomerMode = "existing" | "new";

/* =========================================================
   HOOK
========================================================= */

export function useCreateOrder(onClose: () => void) {
  const dispatch = useAppDispatch();

  /* =======================================================
     REDUX DATA
  ======================================================= */

  const customers = useAppSelector((state) => state.customers.customers);

  const customersLoading = useAppSelector((state) => state.customers.isLoading);

  const customersError = useAppSelector((state) => state.customers.error);

  const products = useAppSelector((state) => state.products.products);

  const productsLoading = useAppSelector((state) => state.products.isLoading);

  const productsError = useAppSelector((state) => state.products.error);

  const reduxSelectedCustomerId = useAppSelector(
    (state) => state.customers.selectedCustomerId,
  );

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
      customerId: reduxSelectedCustomerId,

      deliveryDate: "",

      deliveryTime: "",

      paymentType: "Cash",

      paidAmount: 0,

      billingAddress: "",

      orderType: "Delivery",

      newCustomerName: "",

      newCustomerPhone: "",

      newCustomerEmail: "",

      newCustomerAddress: "",

      newCustomerTier: "Regular",
    },
  });

  const selectedCustomerId = form.watch("customerId");

  const paidAmount = Number(form.watch("paidAmount") || 0);

  /* =======================================================
     CATALOG STATE
  ======================================================= */

  const isCatalogLoading = customersLoading || productsLoading;

  const catalogError = customersError || productsError;

  /* =======================================================
     SELECTED CUSTOMER
  ======================================================= */

  const selectedCustomer = useMemo(() => {
    if (!selectedCustomerId) {
      return null;
    }

    return (
      customers.find(
        (customer) => Number(customer.id) === Number(selectedCustomerId),
      ) ?? null
    );
  }, [customers, selectedCustomerId]);

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
     CUSTOMER MODE
  ======================================================= */

  const switchCustomerMode = (mode: CustomerMode) => {
    setCustomerMode(mode);

    if (mode === "existing") {
      /*
       * Clear new customer fields.
       */

      form.setValue("newCustomerName", "");
      form.setValue("newCustomerPhone", "");
      form.setValue("newCustomerEmail", "");
      form.setValue("newCustomerAddress", "");
      form.setValue("newCustomerTier", "Regular");
    }

    if (mode === "new") {
      /*
       * Clear existing customer selection.
       */

      form.setValue("customerId", null);

      dispatch(setSelectedCustomer(null));
    }
  };

  /* =======================================================
     SELECT EXISTING CUSTOMER
  ======================================================= */

  const selectCustomer = (customerId: number | null) => {
    form.setValue("customerId", customerId, {
      shouldValidate: true,
      shouldDirty: true,
    });

    dispatch(setSelectedCustomer(customerId));
  };

  /* =======================================================
     CREATE NEW CUSTOMER
  ======================================================= */

  const createCustomer = () => {
    const name = form.getValues("newCustomerName").trim();

    const phone = form.getValues("newCustomerPhone").trim();

    const email = form.getValues("newCustomerEmail").trim();

    const address = form.getValues("newCustomerAddress").trim();

    const tier = form.getValues("newCustomerTier");

    if (!name || !phone) {
      return null;
    }

    /*
     * Generate local demo ID.
     */

    const newCustomerId =
      customers.length > 0
        ? Math.max(...customers.map((customer) => customer.id)) + 1
        : 1;

    const newCustomer: Customer = {
      id: newCustomerId,

      name,

      phone,

      ...(email ? { email } : {}),

      ...(address ? { address } : {}),

      tier,
    };

    /*
     * Store in Redux.
     *
     * The customer persistence middleware
     * will keep localStorage synchronized.
     */

    dispatch(addCustomerLocal(newCustomer));

    /*
     * Keep the newly created customer selected.
     */

    form.setValue("customerId", newCustomer.id, {
      shouldValidate: true,
    });

    dispatch(setSelectedCustomer(newCustomer.id));

    /*
     * Populate billing address.
     */

    if (address) {
      form.setValue("billingAddress", address);
    }

    /*
     * Clear the new customer form.
     */

    form.setValue("newCustomerName", "");

    form.setValue("newCustomerPhone", "");

    form.setValue("newCustomerEmail", "");

    form.setValue("newCustomerAddress", "");

    form.setValue("newCustomerTier", "Regular");

    /*
     * IMPORTANT:
     *
     * Stay in NEW mode.
     *
     * We do NOT switch to existing mode.
     */

    return newCustomer;
  };

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
    /*
     * Existing customer mode.
     */

    if (customerMode === "existing") {
      const valid = await form.trigger("customerId");

      if (!valid || !selectedCustomerId || !selectedCustomer) {
        return;
      }
    }

    /*
     * New customer mode.
     *
     * The new customer should already
     * have been created before continuing.
     */

    if (customerMode === "new") {
      if (!selectedCustomer) {
        return;
      }
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

    setSelectedItems([]);

    setStep(1);

    setCustomerMode("existing");

    dispatch(setSelectedCustomer(null));

    onClose();
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    form,

    step,

    customerMode,

    products,

    customers,

    selectedCustomer,

    selectedItems,

    isCatalogLoading,

    catalogError,

    subtotal,

    discount,

    tax,

    total,

    paidAmount,

    remainingAmount,

    paymentStatus,

    switchCustomerMode,

    selectCustomer,

    createCustomer,

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
