import { useEffect, useMemo, useState } from "react";

import { useForm, type SubmitHandler } from "react-hook-form";

import { useAppDispatch } from "../../../app/hooks";

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

import {
    productsApi,
  type Product,
} from "../../products/api/productsApi";

import {
  customersService,
  type Customer,
} from "../../customers/api/customersApi";

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
     CATALOG DATA
  ======================================================= */

  const [products, setProducts] = useState<Product[]>([]);

  const [customers, setCustomers] = useState<Customer[]>([]);

  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  const [catalogError, setCatalogError] = useState<string | null>(null);

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

  const selectedCustomerId = form.watch("customerId");

  const paidAmount = Number(form.watch("paidAmount") || 0);

  /* =======================================================
     LOAD PRODUCTS + CUSTOMERS
  ======================================================= */

  useEffect(() => {
    let isActive = true;

    async function loadCatalog() {
      try {
        setIsCatalogLoading(true);

        setCatalogError(null);

        const [productResponse, customerResponse] = await Promise.all([
          productsApi.getProducts(),
          customersService.getCustomers(),
        ]);

        if (!isActive) {
          return;
        }

        setProducts(productResponse);

        setCustomers(customerResponse);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setCatalogError(
          error instanceof Error
            ? error.message
            : "Unable to load products and customers.",
        );
      } finally {
        if (isActive) {
          setIsCatalogLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isActive = false;
    };
  }, []);

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

          total: product.price,
        },
      ];
    });
  };

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity = (productId: number) => {
    const product = products.find((item) => item.id === productId);

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

    /*
     * -----------------------------------------------------
     * DEMO MODE
     * -----------------------------------------------------
     *
     * Until backend API is connected, use local Redux
     * action.
     *
     * When backend is ready, replace this with:
     *
     * await dispatch(
     *   createOrder(payload)
     * ).unwrap();
     */

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

  return {
    form,

    step,

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
