import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
  isAuthenticated: boolean;
  user: { name: string; role: string; branch: string } | null;
};

const initialState: AuthState = {
  isAuthenticated: true,
  user: {
    name: "Owner",
    role: "admin",
    branch: "Main Branch",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
