import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addOrderLocal } from "../state/ordersSlice";
import { addCustomerLocal, loadLocalCustomers } from "../../customers/state/customerSlice";

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
import { fetchProducts } from "../../products/state/productsSlice";
import type { CreateCustomerPayload, Customer } from "../../customers/types/customer.types";

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
   CUSTOMER MODE
========================================================= */

export type CustomerMode = "existing" | "new";

/* =========================================================
   HOOK
========================================================= */

export function useCreateOrder(onClose: () => void) {
  const dispatch = useAppDispatch();

  /* =======================================================
     PRODUCTS FROM REDUX
  ======================================================= */

  const products = useAppSelector((state) => state.products.products);
  const productsLoading = useAppSelector((state) => state.products.isLoading);
  const productsError = useAppSelector((state) => state.products.error);

  /* =======================================================
     CUSTOMERS FROM REDUX
  ======================================================= */

  const customers = useAppSelector((state) => state.customers.customers);
  const customersLoading = useAppSelector((state) => state.customers.isLoading);
  const customersError = useAppSelector((state) => state.customers.error);
  const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

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

  /* =======================================================
     WATCH FORM VALUES
  ======================================================= */

  const selectedCustomerId = form.watch("customerId");

  const paidAmount = Number(form.watch("paidAmount") || 0);

  /* =======================================================
     LOAD PRODUCTS + CUSTOMERS
  ======================================================= */

  useEffect(() => {
    /*
     * Products:
     *
     * fetchProducts()
     *      ↓
     * productsApi
     *      ↓
     * productsSlice
     *      ↓
     * Redux
     *
     * Customers:
     *
     * fetchCustomers()
     *      ↓
     * customersApi
     *      ↓
     * customersSlice
     *      ↓
     * Redux
     */

    // dispatch(fetchProducts());
    dispatch(loadLocalCustomers());
    // dispatch(fetchCustomers());
  }, [dispatch]);

  /* =======================================================
     CATALOG STATE
  ======================================================= */

  const isCatalogLoading = productsLoading || customersLoading;

  const catalogError = productsError || customersError;

  /* =======================================================
     SELECTED CUSTOMER
  ======================================================= */

  const selectedCustomer = useMemo(
    () =>
      customers.find(
        (customer) => Number(customer.id) === Number(selectedCustomerId),
      ) ?? null,
    [customers, selectedCustomerId],
  );

  /* =======================================================
     SELECT EXISTING CUSTOMER
  ======================================================= */

  const selectCustomer = (customerId: number | null) => {
    form.setValue("customerId", customerId, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  /* =======================================================
     SWITCH CUSTOMER MODE
  ======================================================= */

  const changeCustomerMode = (mode: CustomerMode) => {
    setCustomerMode(mode);

    /*
     * When switching to new customer,
     * remove the existing customer selection.
     */
    if (mode === "new") {
      form.setValue("customerId", null, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  };

  /* =======================================================
     CREATE NEW CUSTOMER
  ======================================================= */

  const createCustomer = (data: CreateCustomerPayload) => {
    if (isCreatingCustomer) {
      return null;
    }

    setIsCreatingCustomer(true);

    try {
      const newCustomer: Customer = {
        id: Date.now(),

        name: data.name.trim(),

        phone: data.phone.trim(),

        email: data.email?.trim() || undefined,

        address: data.address?.trim() || undefined,

        tier: data.tier ?? "Regular",
      };

      /*
       * Add customer to Redux.
       *
       * Your existing localStorage persistence
       * will persist this customer.
       */
      dispatch(addCustomerLocal(newCustomer));

      /*
       * IMPORTANT:
       * Select the newly created customer
       * for THIS order.
       */
      form.setValue("customerId", newCustomer.id, {
        shouldValidate: true,
        shouldDirty: true,
      });

      /*
       * Switch back to existing customer mode.
       *
       * The newly created customer now appears
       * in the existing customer dropdown.
       */
      setCustomerMode("existing");

      return newCustomer;
    } finally {
      setIsCreatingCustomer(false);
    }
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

    /*
     * Do not allow an out-of-stock product to be added.
     */

    if (product.stock <= 0) {
      return;
    }

    setSelectedItems((current) => {
      const existing = current.find((item) => item.productId === product.id);

      /*
       * Product already exists in order.
       */

      if (existing) {
        /*
         * Do not allow quantity to exceed stock.
         */

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

      /*
       * Add new product to order.
       */

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

        /*
         * Do not exceed available stock.
         */

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
    /*
     * Customer must exist.
     */

    if (!selectedCustomer) {
      return;
    }

    /*
     * At least one product must be selected.
     */

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

    /* =====================================================
       DEMO MODE
    =====================================================

       Backend order creation is not being used yet.

       For now we create the order locally and store it
       inside ordersSlice.

       Later this can become:

       dispatch(createOrder(payload)).unwrap();

    ===================================================== */

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
    onClose();
  };

  /* =======================================================
     RETURN
  ======================================================= */

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

    selectedCustomerId,

    isCreatingCustomer,

    isCatalogLoading,

    catalogError,

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

    selectCustomer,

    changeCustomerMode,

    createCustomer,

    goToItemsStep,

    goBack,

    submitOrder,

    resetForm,
  };
}
