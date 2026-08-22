import { useEffect, useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  addCustomerLocal,
  setSelectedCustomer,
} from "../../customers/state/customerSlice";

import type {
  Customer,
  CreateCustomerPayload,
  CustomerTier,
} from "../../customers/types/customer.types";

/* =========================================================
   CUSTOMER MODE
========================================================= */

export type CustomerMode = "existing" | "new";

/* =========================================================
   NEW CUSTOMER FORM
========================================================= */

export type NewCustomerFormValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  tier: CustomerTier;
};

const INITIAL_NEW_CUSTOMER: NewCustomerFormValues = {
  name: "",
  phone: "",
  email: "",
  address: "",
  tier: "Regular",
};

/* =========================================================
   HOOK
========================================================= */

export function useCustomer() {
  const dispatch = useAppDispatch();

  /* =======================================================
     REDUX
  ======================================================= */

  const customers = useAppSelector((state) => state.customers.customers);

  const selectedCustomerId = useAppSelector(
    (state) => state.customers.selectedCustomerId,
  );

  /* =======================================================
     CUSTOMER MODE
  ======================================================= */

  const [customerMode, setCustomerMode] = useState<CustomerMode>("existing");

  /* =======================================================
     SEARCH STATE
  ======================================================= */

  const [searchTerm, setSearchTerm] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  /* =======================================================
     NEW CUSTOMER STATE
  ======================================================= */

  const [newCustomer, setNewCustomer] =
    useState<NewCustomerFormValues>(INITIAL_NEW_CUSTOMER);

  const [newCustomerError, setNewCustomerError] = useState<string | null>(null);

  const [createdCustomer, setCreatedCustomer] = useState<Customer | null>(null);

  /* =======================================================
     SELECTED CUSTOMER
  ======================================================= */

  const selectedCustomer = useMemo<Customer | null>(() => {
    return (
      customers.find(
        (customer) => Number(customer.id) === Number(selectedCustomerId),
      ) ?? null
    );
  }, [customers, selectedCustomerId]);

  /* =======================================================
     FILTER CUSTOMERS
     
     Search:
       - name
       - phone
       - email
  ======================================================= */

  const filteredCustomers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = customer.name?.toLowerCase() ?? "";

      const phone = customer.phone?.toLowerCase() ?? "";

      const email = customer.email?.toLowerCase() ?? "";

      return (
        name.includes(normalizedSearch) ||
        phone.includes(normalizedSearch) ||
        email.includes(normalizedSearch)
      );
    });
  }, [customers, searchTerm]);

  /* =======================================================
     HIGHLIGHT FIRST RESULT
  ======================================================= */

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    if (filteredCustomers.length === 0) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex(0);
  }, [filteredCustomers, isSearchOpen]);

  /* =======================================================
     SELECT CUSTOMER
  ======================================================= */

  const selectCustomer = (customerId: number) => {
    dispatch(setSelectedCustomer(customerId));

    setSearchTerm("");

    setIsSearchOpen(false);

    setHighlightedIndex(-1);

    setCreatedCustomer(null);
  };

  /* =======================================================
     SEARCH CHANGE
  ======================================================= */

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    setIsSearchOpen(true);

    if (value.trim() && filteredCustomers.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  };

  /* =======================================================
     SEARCH FOCUS
  ======================================================= */

  const handleSearchFocus = () => {
    setIsSearchOpen(true);

    if (filteredCustomers.length > 0) {
      setHighlightedIndex(0);
    }
  };

  /* =======================================================
     SEARCH CLOSE
  ======================================================= */

  const closeSearch = () => {
    setIsSearchOpen(false);

    setHighlightedIndex(-1);
  };

  /* =======================================================
     KEYBOARD NAVIGATION
     
     ArrowDown
     ArrowUp
     Enter
     Escape
  ======================================================= */

  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isSearchOpen) {
        setIsSearchOpen(true);

        if (filteredCustomers.length > 0) {
          setHighlightedIndex(
            event.key === "ArrowDown" ? 0 : filteredCustomers.length - 1,
          );
        }

        return;
      }

      if (filteredCustomers.length === 0) {
        return;
      }

      setHighlightedIndex((currentIndex) => {
        if (event.key === "ArrowDown") {
          if (currentIndex >= filteredCustomers.length - 1) {
            return 0;
          }

          return currentIndex + 1;
        }

        if (currentIndex <= 0) {
          return filteredCustomers.length - 1;
        }

        return currentIndex - 1;
      });

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (
        isSearchOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < filteredCustomers.length
      ) {
        selectCustomer(filteredCustomers[highlightedIndex].id);
      }

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();

      closeSearch();
    }
  };

  /* =======================================================
     CUSTOMER MODE CHANGE
  ======================================================= */

  const changeCustomerMode = (mode: CustomerMode) => {
    setCustomerMode(mode);

    setSearchTerm("");

    setIsSearchOpen(false);

    setHighlightedIndex(-1);

    setNewCustomerError(null);

    if (mode === "existing") {
      setCreatedCustomer(null);
    }
  };

  /* =======================================================
     CREATE CUSTOMER
  ======================================================= */

  const createCustomer = (): Customer | null => {
    setNewCustomerError(null);

    const name = newCustomer.name.trim();

    const phone = newCustomer.phone.trim();

    const email = newCustomer.email.trim();

    const address = newCustomer.address.trim();

    /* -----------------------------------------------------
       REQUIRED FIELDS
    ----------------------------------------------------- */

    if (!name) {
      setNewCustomerError("Customer name is required.");

      return null;
    }

    if (!phone) {
      setNewCustomerError("Customer phone is required.");

      return null;
    }

    /* -----------------------------------------------------
       DUPLICATE PHONE
    ----------------------------------------------------- */

    const existingCustomer = customers.find(
      (customer) => customer.phone.trim() === phone,
    );

    if (existingCustomer) {
      setNewCustomerError(
        "A customer with this phone number already exists. Please use the existing customer.",
      );

      return null;
    }

    /* -----------------------------------------------------
       PAYLOAD
    ----------------------------------------------------- */

    const payload: CreateCustomerPayload = {
      name,
      phone,
      email: email || undefined,
      address: address || undefined,
      tier: newCustomer.tier,
    };

    /* -----------------------------------------------------
       GENERATE LOCAL ID
    ----------------------------------------------------- */

    const nextId =
      customers.length > 0
        ? Math.max(...customers.map((customer) => customer.id)) + 1
        : 1;

    const customer: Customer = {
      id: nextId,
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      tier: payload.tier ?? "Regular",
    };

    /* -----------------------------------------------------
       REDUX + LOCAL STORAGE
       
       addCustomerLocal handles persistence.
    ----------------------------------------------------- */

    dispatch(addCustomerLocal(customer));

    /* -----------------------------------------------------
       SELECT NEW CUSTOMER
    ----------------------------------------------------- */

    dispatch(setSelectedCustomer(customer.id));

    /* -----------------------------------------------------
       KEEP NEW CUSTOMER MODE
    ----------------------------------------------------- */

    setCreatedCustomer(customer);

    /*
     * Important:
     *
     * We DO NOT change customerMode here.
     *
     * User remains in "new" mode.
     */

    /* -----------------------------------------------------
       CLEAR FORM
    ----------------------------------------------------- */

    setNewCustomer(INITIAL_NEW_CUSTOMER);

    return customer;
  };

  /* =======================================================
     CREATE ANOTHER CUSTOMER
  ======================================================= */

  const createAnotherCustomer = () => {
    setCreatedCustomer(null);

    setNewCustomerError(null);

    setNewCustomer(INITIAL_NEW_CUSTOMER);
  };

  /* =======================================================
     UPDATE NEW CUSTOMER FIELD
  ======================================================= */

  const updateNewCustomer = <K extends keyof NewCustomerFormValues>(
    field: K,
    value: NewCustomerFormValues[K],
  ) => {
    setNewCustomer((current) => ({
      ...current,
      [field]: value,
    }));

    if (newCustomerError) {
      setNewCustomerError(null);
    }
  };

  /* =======================================================
     CHANGE SELECTED CUSTOMER
  ======================================================= */

  const changeSelectedCustomer = () => {
    dispatch(setSelectedCustomer(null));

    setSearchTerm("");

    setIsSearchOpen(true);

    setHighlightedIndex(customers.length > 0 ? 0 : -1);
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    /* -----------------------------------------------
       DATA
    ----------------------------------------------- */

    customers,

    selectedCustomer,

    selectedCustomerId,

    /* -----------------------------------------------
       MODE
    ----------------------------------------------- */

    customerMode,

    changeCustomerMode,

    /* -----------------------------------------------
       SEARCH
    ----------------------------------------------- */

    searchTerm,

    isSearchOpen,

    filteredCustomers,

    highlightedIndex,

    handleSearchChange,

    handleSearchFocus,

    handleSearchKeyDown,

    closeSearch,

    selectCustomer,

    changeSelectedCustomer,

    /* -----------------------------------------------
       NEW CUSTOMER
    ----------------------------------------------- */

    newCustomer,

    newCustomerError,

    createdCustomer,

    updateNewCustomer,

    createCustomer,

    createAnotherCustomer,
  };
}
