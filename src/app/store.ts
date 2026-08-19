import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/authSlice";
import salesReducer from "../features/sales/salesSlice";
import ordersReducer from "../features/orders/state/ordersSlice";
import customerReducer from "../features/customers/state/customerSlice";
import productsReducer from "../features/products/state/productsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sales: salesReducer,
    orders: ordersReducer,
    customers: customerReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
