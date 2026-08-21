import type { Customer } from "../types/customer.types";

const CUSTOMERS_STORAGE_KEY = "customers";

/* =========================================================
   DUMMY CUSTOMERS
========================================================= */

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Rahim Ahmed",
    phone: "9876543210",
    email: "rahim@example.com",
    address: "Pune, Maharashtra",
    tier: "Gold",
  },
  {
    id: 2,
    name: "Nadia Hasan",
    phone: "9876543211",
    email: "nadia@example.com",
    address: "Mumbai, Maharashtra",
    tier: "Gold",
  },
  {
    id: 3,
    name: "Shahab Ali",
    phone: "9876543212",
    email: "shahab@example.com",
    address: "Pune, Maharashtra",
    tier: "Silver",
  },
];

/* =========================================================
   GET CUSTOMERS
========================================================= */

export function getStoredCustomers(): Customer[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCustomers = localStorage.getItem(CUSTOMERS_STORAGE_KEY);

    if (!storedCustomers) {
      localStorage.setItem(
        CUSTOMERS_STORAGE_KEY,
        JSON.stringify(initialCustomers),
      );

      return initialCustomers;
    }

    const parsedCustomers: unknown = JSON.parse(storedCustomers);

    if (!Array.isArray(parsedCustomers)) {
      localStorage.setItem(
        CUSTOMERS_STORAGE_KEY,
        JSON.stringify(initialCustomers),
      );

      return initialCustomers;
    }

    return parsedCustomers as Customer[];
  } catch {
    return initialCustomers;
  }
}

/* =========================================================
   SAVE CUSTOMERS
========================================================= */

export function saveCustomers(customers: Customer[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
}

/* =========================================================
   ADD CUSTOMER
========================================================= */

export function addStoredCustomer(customer: Customer): Customer[] {
  const customers = getStoredCustomers();

  const updatedCustomers = [customer, ...customers];

  saveCustomers(updatedCustomers);

  return updatedCustomers;
}

/* =========================================================
   UPDATE CUSTOMER
========================================================= */

export function updateStoredCustomer(customer: Customer): Customer[] {
  const customers = getStoredCustomers();

  const updatedCustomers = customers.map((existingCustomer) =>
    existingCustomer.id === customer.id ? customer : existingCustomer,
  );

  saveCustomers(updatedCustomers);

  return updatedCustomers;
}

/* =========================================================
   REMOVE CUSTOMER
========================================================= */

export function removeStoredCustomer(customerId: number): Customer[] {
  const customers = getStoredCustomers();

  const updatedCustomers = customers.filter(
    (customer) => customer.id !== customerId,
  );

  saveCustomers(updatedCustomers);

  return updatedCustomers;
}

/* =========================================================
   GENERATE CUSTOMER ID
========================================================= */

export function generateCustomerId(customers: Customer[]): number {
  if (customers.length === 0) {
    return 1;
  }

  return Math.max(...customers.map((customer) => customer.id)) + 1;
}
