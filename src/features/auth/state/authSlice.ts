import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Permission, Role } from "../permissions";

export type AuthUser = {
  id?: number;
  name: string;
  role: Role;
  branch: string;
  permissions: Permission[];
  token?: string;
};

export type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
};

const getStoredAuth = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      isAuthenticated: false,
      user: null,
    };
  }

  const stored = localStorage.getItem("salesflow-auth");

  if (!stored) {
    return {
      isAuthenticated: false,
      user: null,
    };
  }

  try {
    const parsed = JSON.parse(stored) as AuthState;
    return {
      isAuthenticated: Boolean(parsed.isAuthenticated),
      user: parsed.user ?? null,
    };
  } catch {
    return {
      isAuthenticated: false,
      user: null,
    };
  }
};

const initialState: AuthState = getStoredAuth();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem(
          "salesflow-auth",
          JSON.stringify({
            isAuthenticated: true,
            user: action.payload,
            token: action.payload.token ?? "demo-token",
          }),
        );
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("salesflow-auth");
      }
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
