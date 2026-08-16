import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  name: string;
  role: string;
  branch: string;
};

type AuthState = {
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
    return JSON.parse(stored) as AuthState;
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
