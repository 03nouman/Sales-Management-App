import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import {  ordersApi } from "../api/ordersApi";

import type {
  CreateOrderPayload,
  Order,
  UpdateOrderPaymentPayload,
  UpdateOrderStatusPayload,
} from "../types/order.types";

import type { OrdersState } from "../types/orderState.types";

const initialState: OrdersState = {
  orders: [],

  isLoading: false,

  isCreating: false,

  isUpdating: false,

  error: null,

  selectedOrderId: null,
};

/* =========================================================
   FETCH ORDERS
========================================================= */

export const fetchOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("orders/fetchOrders", async (_, { rejectWithValue }) => {
  try {
    return await ordersApi.getOrders();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to fetch orders.",
    );
  }
});

/* =========================================================
   FETCH SINGLE ORDER
========================================================= */

export const fetchOrderById = createAsyncThunk<
  Order,
  number,
  { rejectValue: string }
>("orders/fetchOrderById", async (orderId, { rejectWithValue }) => {
  try {
    return await ordersApi.getOrderById(orderId);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to fetch order.",
    );
  }
});

/* =========================================================
   CREATE ORDER
========================================================= */

export const createOrder = createAsyncThunk<
  Order,
  CreateOrderPayload,
  { rejectValue: string }
>("orders/createOrder", async (payload, { rejectWithValue }) => {
  try {
    return await ordersApi.createOrder(payload);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to create order.",
    );
  }
});

/* =========================================================
   UPDATE ORDER STATUS
========================================================= */

export const updateOrderStatus = createAsyncThunk<
  Order,
  UpdateOrderStatusPayload,
  { rejectValue: string }
>("orders/updateOrderStatus", async (payload, { rejectWithValue }) => {
  try {
    return await ordersApi.updateOrderStatus(payload);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to update order status.",
    );
  }
});

/* =========================================================
   UPDATE PAYMENT
========================================================= */

export const updateOrderPayment = createAsyncThunk<
  Order,
  UpdateOrderPaymentPayload,
  { rejectValue: string }
>("orders/updateOrderPayment", async (payload, { rejectWithValue }) => {
  try {
    return await ordersApi.updateOrderPayment(payload);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : "Unable to update order payment.",
    );
  }
});

/* =========================================================
   CANCEL ORDER
========================================================= */

export const cancelOrder = createAsyncThunk<
  Order,
  number,
  { rejectValue: string }
>("orders/cancelOrder", async (orderId, { rejectWithValue }) => {
  try {
    return await ordersApi.cancelOrder(orderId);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unable to cancel order.",
    );
  }
});

/* =========================================================
   SLICE
========================================================= */

const ordersSlice = createSlice({
  name: "orders",

  initialState,

  reducers: {
    setSelectedOrder(state, action: PayloadAction<number | null>) {
      state.selectedOrderId = action.payload;
    },

    clearSelectedOrder(state) {
      state.selectedOrderId = null;
    },

    clearOrdersError(state) {
      state.error = null;
    },

    /**
     * Local/demo action.
     *
     * Useful while backend is not connected.
     */
    addOrderLocal(state, action: PayloadAction<Order>) {
      state.orders.unshift(action.payload);
    },

    /**
     * Local/demo update.
     */
    updateOrderLocal(state, action: PayloadAction<Order>) {
      const index = state.orders.findIndex(
        (order) => order.id === action.payload.id,
      );

      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },

    /**
     * Local/demo removal.
     */
    removeOrderLocal(state, action: PayloadAction<number>) {
      state.orders = state.orders.filter(
        (order) => order.id !== action.payload,
      );
    },

    resetOrders(state) {
      state.orders = [];

      state.isLoading = false;
      state.isCreating = false;
      state.isUpdating = false;

      state.error = null;

      state.selectedOrderId = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===============================================
         FETCH ORDERS
      =============================================== */

      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;

        state.orders = action.payload;
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload ?? "Unable to fetch orders.";
      })

      /* ===============================================
         FETCH SINGLE ORDER
      =============================================== */

      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;

        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );

        if (index === -1) {
          state.orders.push(action.payload);
        } else {
          state.orders[index] = action.payload;
        }

        state.selectedOrderId = action.payload.id;
      })

      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload ?? "Unable to fetch order.";
      })

      /* ===============================================
         CREATE ORDER
      =============================================== */

      .addCase(createOrder.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreating = false;

        state.orders.unshift(action.payload);

        state.selectedOrderId = action.payload.id;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.isCreating = false;

        state.error = action.payload ?? "Unable to create order.";
      })

      /* ===============================================
         UPDATE STATUS
      =============================================== */

      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdating = false;

        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );

        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdating = false;

        state.error = action.payload ?? "Unable to update order status.";
      })

      /* ===============================================
         UPDATE PAYMENT
      =============================================== */

      .addCase(updateOrderPayment.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })

      .addCase(updateOrderPayment.fulfilled, (state, action) => {
        state.isUpdating = false;

        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );

        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      .addCase(updateOrderPayment.rejected, (state, action) => {
        state.isUpdating = false;

        state.error = action.payload ?? "Unable to update payment.";
      })

      /* ===============================================
         CANCEL ORDER
      =============================================== */

      .addCase(cancelOrder.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isUpdating = false;

        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );

        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.isUpdating = false;

        state.error = action.payload ?? "Unable to cancel order.";
      });
  },
});

export const {
  setSelectedOrder,
  clearSelectedOrder,
  clearOrdersError,
  addOrderLocal,
  updateOrderLocal,
  removeOrderLocal,
  resetOrders,
} = ordersSlice.actions;

export default ordersSlice.reducer;
