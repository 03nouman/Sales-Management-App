import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";

import {
  addCustomerLocal,
  clearSelectedCustomer,
  setSelectedCustomer,
} from "../state/customerSlice";

import type {
  Customer,
  CreateCustomerPayload,
  CustomerTier,
} from "../types/customer.types";

import type { CustomerMode } from "../types/customerMode.types";

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

/* =========================================================
   DEFAULT NEW CUSTOMER
========================================================= */

const defaultNewCustomer: NewCustomerFormValues = {
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
     CUSTOMERS FROM REDUX
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
     SEARCH
  ======================================================= */

  const searchId = useId();

  const [searchTerm, setSearchTerm] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  /* =======================================================
     NEW CUSTOMER
  ======================================================= */

  const [newCustomer, setNewCustomer] =
    useState<NewCustomerFormValues>(defaultNewCustomer);

  const [newCustomerError, setNewCustomerError] = useState<string | null>(null);

  const [createdCustomer, setCreatedCustomer] = useState<Customer | null>(null);

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
     FILTER CUSTOMERS
     
     Search:
       - Name
       - Phone
       - Email
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
     SEARCH RESULT HIGHLIGHT
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
     CLICK OUTSIDE SEARCH
  ======================================================= */

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const container = searchContainerRef.current;

      if (!container) {
        return;
      }

      if (!container.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

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
     SELECT CUSTOMER OBJECT
  ======================================================= */

  const handleSelectCustomer = (customer: Customer) => {
    selectCustomer(customer.id);
  };

  /* =======================================================
     SEARCH OPEN
  ======================================================= */

  const openCustomerSearch = () => {
    setIsSearchOpen(true);

    if (filteredCustomers.length > 0) {
      setHighlightedIndex(0);
    }
  };

  /* =======================================================
     CHANGE CUSTOMER
  ======================================================= */

  const changeCustomer = () => {
    dispatch(clearSelectedCustomer());

    setSearchTerm("");

    setIsSearchOpen(true);

    if (filteredCustomers.length > 0) {
      setHighlightedIndex(0);
    } else {
      setHighlightedIndex(-1);
    }
  };

  /* =======================================================
     SEARCH KEYBOARD NAVIGATION
     
     ArrowDown
     ArrowUp
     Enter
     Escape
  ======================================================= */

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    /* -----------------------------------------------------
       ARROW DOWN / UP
    ----------------------------------------------------- */

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

    /* -----------------------------------------------------
       ENTER
    ----------------------------------------------------- */

    if (event.key === "Enter") {
      event.preventDefault();

      if (
        isSearchOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < filteredCustomers.length
      ) {
        handleSelectCustomer(filteredCustomers[highlightedIndex]);
      }

      return;
    }

    /* -----------------------------------------------------
       ESCAPE
    ----------------------------------------------------- */

    if (event.key === "Escape") {
      event.preventDefault();

      setIsSearchOpen(false);

      setHighlightedIndex(-1);
    }
  };

  /* =======================================================
     SEARCH CHANGE
  ======================================================= */

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);

    setIsSearchOpen(true);

    setHighlightedIndex(0);
  };

  /* =======================================================
     CUSTOMER MODE
  ======================================================= */

  const handleCustomerModeChange = (mode: CustomerMode) => {
    setNewCustomerError(null);

    setSearchTerm("");

    setIsSearchOpen(false);

    setHighlightedIndex(-1);

    if (mode === "existing") {
      setCreatedCustomer(null);
    }

    setCustomerMode(mode);
  };

  /* =======================================================
     NEW CUSTOMER FIELD UPDATE
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
     CREATE CUSTOMER
  ======================================================= */

  const createCustomer = (): Customer | null => {
    setNewCustomerError(null);

    const name = newCustomer.name.trim();

    const phone = newCustomer.phone.trim();

    const email = newCustomer.email.trim();

    const address = newCustomer.address.trim();

    /* -----------------------------------------------------
       VALIDATION
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

    const normalizedPhone = phone.replace(/\s+/g, "");

    const existingCustomer = customers.find(
      (customer) => customer.phone.replace(/\s+/g, "") === normalizedPhone,
    );

    if (existingCustomer) {
      setNewCustomerError(
        "A customer with this phone number already exists. Please use the existing customer.",
      );

      return null;
    }

    /* -----------------------------------------------------
       GENERATE LOCAL ID
    ----------------------------------------------------- */

    const nextId =
      customers.length > 0
        ? Math.max(...customers.map((customer) => customer.id)) + 1
        : 1;

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

    const customer: Customer = {
      id: nextId,
      ...payload,
    };

    /* -----------------------------------------------------
       REDUX + LOCAL STORAGE
    ----------------------------------------------------- */

    dispatch(addCustomerLocal(customer));

    /*
     * IMPORTANT:
     *
     * We intentionally keep customerMode = "new".
     *
     * The new customer is selected in Redux, but the UI
     * stays in New Customer mode.
     */

    setCreatedCustomer(customer);

    /* -----------------------------------------------------
       CLEAR FORM
    ----------------------------------------------------- */

    setNewCustomer(defaultNewCustomer);

    return customer;
  };

  /* =======================================================
     CREATE ANOTHER CUSTOMER
  ======================================================= */

  const createAnotherCustomer = () => {
    setCreatedCustomer(null);

    setNewCustomerError(null);

    setNewCustomer(defaultNewCustomer);
  };

  /* =======================================================
     RESET CUSTOMER WORKFLOW
  ======================================================= */

  const resetCustomer = () => {
    dispatch(clearSelectedCustomer());

    setCustomerMode("existing");

    setSearchTerm("");

    setIsSearchOpen(false);

    setHighlightedIndex(-1);

    setNewCustomer(defaultNewCustomer);

    setNewCustomerError(null);

    setCreatedCustomer(null);
  };

  /* =======================================================
     RETURN
  ======================================================= */

  return {
    /* -----------------------------------------------------
       CUSTOMER DATA
    ----------------------------------------------------- */

    customers,

    selectedCustomer,

    selectedCustomerId,

    /* -----------------------------------------------------
       CUSTOMER MODE
    ----------------------------------------------------- */

    customerMode,

    setCustomerMode: handleCustomerModeChange,

    /* -----------------------------------------------------
       SEARCH
    ----------------------------------------------------- */

    searchId,

    searchTerm,

    isSearchOpen,

    highlightedIndex,

    filteredCustomers,

    searchContainerRef,

    setSearchTerm: handleSearchChange,

    openCustomerSearch,

    handleSearchKeyDown,

    handleSelectCustomer,

    changeCustomer,

    /* -----------------------------------------------------
       NEW CUSTOMER
    ----------------------------------------------------- */

    newCustomer,

    updateNewCustomer,

    newCustomerError,

    createdCustomer,

    createCustomer,

    createAnotherCustomer,

    /* -----------------------------------------------------
       RESET
    ----------------------------------------------------- */

    resetCustomer,
  };
}
