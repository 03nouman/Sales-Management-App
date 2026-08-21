import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { customersApi } from "../api/customersApi";
import type { Customer } from "../types/customer.types";
import type { CustomersState } from "../types/customerState.types";
import { getStoredCustomers, saveCustomers } from "../utils/customerStorage";

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: CustomersState = {
  customers: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  selectedCustomerId: null,
};

/* =========================================================
   LOAD LOCAL CUSTOMERS
========================================================= */

export const loadLocalCustomers = createAsyncThunk<
  Customer[],
  void,
  {
    rejectValue: string;
  }
>("customers/loadLocalCustomers", async (_, { rejectWithValue }) => {
  try {
    return getStoredCustomers();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Unable to load local customers.",
    );
  }
});

/* =========================================================
   FETCH CUSTOMERS
========================================================= */

export const fetchCustomers = createAsyncThunk<
  Customer[],
  void,
  {
    rejectValue: string;
  }
>("customers/fetchCustomers", async (_, { rejectWithValue }) => {
  try {
    return await customersApi.getCustomers();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to fetch customers.",
    );
  }
});

/* =========================================================
   FETCH CUSTOMER BY ID
========================================================= */

export const fetchCustomerById = createAsyncThunk<
  Customer,
  number,
  {
    rejectValue: string;
  }
>("customers/fetchCustomerById", async (customerId, { rejectWithValue }) => {
  try {
    return await customersApi.getCustomerById(customerId);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to fetch customer.",
    );
  }
});

/* =========================================================
   SLICE
========================================================= */

const customersSlice = createSlice({
  name: "customers",

  initialState,

  reducers: {
    /* =====================================================
       SELECT CUSTOMER
    ===================================================== */

    setSelectedCustomer(state, action: PayloadAction<number | null>) {
      state.selectedCustomerId = action.payload;
    },

    /* =====================================================
       CLEAR SELECTED CUSTOMER
    ===================================================== */

    clearSelectedCustomer(state) {
      state.selectedCustomerId = null;
    },

    /* =====================================================
       CLEAR ERROR
    ===================================================== */

    clearCustomersError(state) {
      state.error = null;
    },

    /* =====================================================
       LOCAL ADD CUSTOMER
       
       Used for demo mode until create API exists.
    ===================================================== */

    addCustomerLocal(state, action: PayloadAction<Customer>) {
      state.customers.unshift(action.payload);
      state.selectedCustomerId = action.payload.id;
      saveCustomers(state.customers);
    },

    /* =====================================================
       LOCAL UPDATE CUSTOMER
    ===================================================== */

    updateCustomerLocal(state, action: PayloadAction<Customer>) {
      const index = state.customers.findIndex(
        (customer) => customer.id === action.payload.id,
      );

      if (index !== -1) {
        state.customers[index] = action.payload;
        saveCustomers(state.customers);
      }
    },

    /* =====================================================
       LOCAL REMOVE CUSTOMER
    ===================================================== */

    removeCustomerLocal(state, action: PayloadAction<number>) {
      state.customers = state.customers.filter(
        (customer) => customer.id !== action.payload,
      );

      if (state.selectedCustomerId === action.payload) {
        state.selectedCustomerId = null;
      }

      saveCustomers(state.customers);
    },

    /* =====================================================
       RESET
    ===================================================== */

    resetCustomers(state) {
      state.customers = [];
      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;
      state.isDeleting = false;
      state.error = null;
      state.selectedCustomerId = null;
    },
  },

  /* =======================================================
     EXTRA REDUCERS
  ======================================================= */

  extraReducers: (builder) => {
    builder

      /* ===================================================
         LOAD LOCAL CUSTOMERS
      =================================================== */

      .addCase(loadLocalCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loadLocalCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })

      .addCase(loadLocalCustomers.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload ?? "Unable to load local customers.";
      })

      /* ===================================================
         FETCH CUSTOMERS
         -----------------------------------------------
         Future backend functionality
      =================================================== */

      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
      })

      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload ?? "Unable to fetch customers.";
      })

      /* ===================================================
         FETCH CUSTOMER BY ID
      =================================================== */

      .addCase(fetchCustomerById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.isLoading = false;

        const existingIndex = state.customers.findIndex(
          (customer) => customer.id === action.payload.id,
        );

        if (existingIndex === -1) {
          state.customers.push(action.payload);
        } else {
          state.customers[existingIndex] = action.payload;
        }

        state.selectedCustomerId = action.payload.id;
      })

      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload ?? "Unable to fetch customer.";
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  setSelectedCustomer,
  clearSelectedCustomer,
  clearCustomersError,
  addCustomerLocal,
  updateCustomerLocal,
  removeCustomerLocal,
  resetCustomers,
} = customersSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default customersSlice.reducer;
