import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/authSlice";
import salesReducer from "../features/sales/salesSlice";
import ordersReducer from "../features/orders/state/ordersSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sales: salesReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
